import { GraphQLError } from 'graphql'
import type { AuthMutationsResolvers, User } from '#types'
import { AuthMethod, SignUpError, VerificationCodeState } from '#types'
import type { VerificationCodeSubmitTokenPayload } from './verification-code-submit/types'
import type { NicknameOwnership } from '#model/nickname-ownership'
import { compactDecrypt } from 'jose'
import { AuthAccount } from '#framework/auth/auth-account'
import jwt from 'jsonwebtoken'
import { validate, sanitize } from '@/schema/auth/sign-up'
import { getAuthKey, getAuthKeyObject } from '#framework/auth/key'
import { create as createUUID } from '#util/uuid'
import { getRolesAndPermissionsFromUser } from '#framework/auth/roles-and-permissions'
import { createAuthToken } from '#framework/auth/auth-token'
import { testRateLimiter } from '@/server/services/rate-limiter'
import { createPasswordHash } from './util'
import { runTransaction } from '@/server/framework/database/transaction'
import { createInTransaction } from '@/server/framework/database/write/create'
import {
  readDirectly,
  readInTransaction,
} from '@/server/framework/database/read'
import { updateInTransaction } from '@/server/framework/database/write/update'

export const signUp: AuthMutationsResolvers['signUp'] = async (
  _,
  { input: _input },
  { setAuthToken },
) => {
  const errors = validate(_input)
  if (errors) {
    throw new GraphQLError(`validation error!`, {
      extensions: { code: 'VALIDATION_FAIL', errors },
    })
  }

  const { password, nickname, accountType, verificationCodeSubmitToken } =
    sanitize(_input)

  //
  const { plaintext: decryptedTokenBuffer /*, protectedHeader */ } =
    await compactDecrypt(verificationCodeSubmitToken, getAuthKeyObject())

  const decryptedToken = new TextDecoder().decode(decryptedTokenBuffer)

  let jwtResult: VerificationCodeSubmitTokenPayload
  try {
    jwtResult = jwt.verify(
      decryptedToken,
      getAuthKey(),
    ) as VerificationCodeSubmitTokenPayload
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any)?.name === `TokenExpiredError`) {
      throw new GraphQLError(`verification time expired`, {
        extensions: { code: SignUpError.VerificationTimeExpired },
      })
    }
    throw e
  }

  const {
    data: {
      // requestId,
      method, // you can proceed with the given method!
      state,
      createdAtMilliseconds, // this will be checked at the server.
      authId, // you can use this phone number!
    },
  } = jwtResult

  if (method !== AuthMethod.SignUp) {
    throw new GraphQLError(`Invalid method`, {
      extensions: { code: SignUpError.InvalidMethod },
    })
  }

  if (state !== VerificationCodeState.VerificationCodeSubmit) {
    throw new GraphQLError(`Invalid state`, {
      extensions: { code: SignUpError.InvalidState },
    })
  }

  if (createdAtMilliseconds + 20 * 60 * 1000 < Date.now()) {
    throw new GraphQLError(`verification time expired`, {
      extensions: { code: SignUpError.VerificationTimeExpired },
    })
  }

  ///

  // acquire two locks! 5 per sec lock
  const shortLockAcquired = await testRateLimiter(
    `signup-per-sec:${authId}`,
    5,
    5 * 1000,
  )

  if (!shortLockAcquired) {
    throw new GraphQLError(`rate limited`, {
      extensions: { code: SignUpError.RateLimited },
    })
  }

  // acquire two locks! 10 per 60 sec lock
  const longLockAcquired = await testRateLimiter(
    `signup-total:${authId}`,
    10,
    60 * 1000,
  )

  if (!longLockAcquired) {
    throw new GraphQLError(`rate limited`, {
      extensions: { code: SignUpError.RateLimited },
    })
  }
  //

  const userId = createUUID(7)
  const pwhash = await createPasswordHash(password)

  await runTransaction(async (transaction) => {
    const currentTimeSeconds = Math.floor(Date.now() / 1000)
    const prevAuthAccount = await readInTransaction<AuthAccount>(
      `/auth-accounts/${authId}`,
      transaction,
    )

    if (prevAuthAccount) {
      throw new GraphQLError(`account already exists!`, {
        extensions: { code: SignUpError.AccountAlreadyExists },
      })
    }

    const encodedNickname = encodeURIComponent(nickname)
    const prevNicknameOwnership = await readInTransaction<NicknameOwnership>(
      `/nickname-ownerships/${encodedNickname}`,
      transaction,
    )
    if (prevNicknameOwnership) {
      const { revoked } = prevNicknameOwnership
      if (!revoked) {
        // unrevoked nickname owner exists!
        throw new GraphQLError(`nickname already exists!`, {
          extensions: { code: SignUpError.NicknameAlreadyExists },
        })
      }
    }

    createInTransaction<AuthAccount>(
      `/auth-accounts/${authId}`,
      {
        authId,
        defaultUserId: userId,
        pwhash,
      },
      transaction,
    )

    if (prevNicknameOwnership) {
      // already exists! only switch ownership
      updateInTransaction<NicknameOwnership>(
        `/nickname-ownerships/${encodedNickname}`,
        {
          userId,
          revoked: false,
          acquiredAtSeconds: currentTimeSeconds,
        },
        transaction,
      )
    } else {
      // create!
      createInTransaction<NicknameOwnership>(
        `/nickname-ownerships/${encodedNickname}`,
        {
          encodedNickname,
          nickname,
          userId,
          revoked: false,
          acquiredAtSeconds: currentTimeSeconds,
        },
        transaction,
      )
    }

    createInTransaction<User>(
      `/users/${userId}`,
      {
        userId,
        public: {
          nickname,
          accountType,
        },
        private: {
          isAdmin: false,
        },
      },
      transaction,
    )
  })

  const user = await readDirectly<User>(`/users/${userId}`)

  if (!user) {
    // user should exist here! if not found, something very wrong happened.
    throw new Error(`user not found!`)
  }

  const rolesAndPermissions = getRolesAndPermissionsFromUser(user)
  const { token: authToken } = await createAuthToken({
    userId,
    rolesAndPermissions,
  })

  setAuthToken(authToken)

  return {
    user,
  }
}
