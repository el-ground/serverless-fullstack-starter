import { GraphQLError } from 'graphql'
import type { MutationResolvers, User } from '#types'
import { AuthMethod, SignUpError, VerificationCodeState } from '#types'
import type { VerificationCodeSubmitTokenPayload } from './verification-code-submit/types'
import { acquireNicknameOwnershipInTransaction } from '#model/nickname-ownership'
import { AuthAccount } from '#framework/auth/auth-account'
import { validate, sanitize } from '@/schema/auth/sign-up'
import { create as createUUID } from '#util/uuid'
import { getRolesAndPermissionsFromUser } from '#framework/auth/roles-and-permissions'
import { createAuthToken } from '#framework/auth/auth-token'
import { testRateLimiter } from '@/server/services/rate-limiter'
import { createPasswordHash, decodeAuthKeySignedToken } from './util'
import { runTransaction } from '@/server/framework/database/transaction'
import { overwriteInTransaction } from '#framework/database/write/overwrite'
import {
  readDirectly,
  readInTransaction,
} from '@/server/framework/database/read'
import { VALIDATION_FAIL } from '#types/common-errors'
import { createUserInTransaction } from '@/server/model/user/create-user'

export const Auth_signUp: MutationResolvers['Auth_signUp'] = async (
  _,
  { input: _input },
  { setAuthToken },
) => {
  const errors = validate(_input)
  if (errors) {
    throw new GraphQLError(`validation error!`, {
      extensions: { code: VALIDATION_FAIL, errors },
    })
  }

  const { password, nickname, accountType, verificationCodeSubmitToken } =
    sanitize(_input)

  let verificationCodeSubmitTokenPayload: VerificationCodeSubmitTokenPayload
  try {
    verificationCodeSubmitTokenPayload = await decodeAuthKeySignedToken(
      verificationCodeSubmitToken,
    )
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
  } = verificationCodeSubmitTokenPayload

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
    const prevAuthAccount = await readInTransaction<AuthAccount>(
      `/auth-accounts/${authId}`,
      transaction,
    )

    if (prevAuthAccount && !prevAuthAccount.revoked) {
      throw new GraphQLError(`account already exists!`, {
        extensions: { code: SignUpError.AccountAlreadyExists },
      })
    }

    const nicknameAcquireStatus = await acquireNicknameOwnershipInTransaction(
      nickname,
      userId,
      transaction,
    )

    if (nicknameAcquireStatus === `OCCUPIED`) {
      throw new GraphQLError(`nickname already exists!`, {
        extensions: { code: SignUpError.NicknameAlreadyExists },
      })
    }

    overwriteInTransaction<AuthAccount>(
      `/auth-accounts/${authId}`,
      {
        authId,
        defaultUserId: userId,
        pwhash,
        revoked: false,
      },
      transaction,
    )

    createUserInTransaction(
      {
        userId,
        nickname,
        accountType,
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
    authId,
    rolesAndPermissions,
  })

  setAuthToken(authToken)

  return {
    user,
  }
}
