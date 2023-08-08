import { GraphQLError } from 'graphql'
import type { MutationResolvers, User } from '#types'
import type { AuthAccount } from '#framework/auth/auth-account'
import { PasswordResetError, AuthMethod, VerificationCodeState } from '#types'
import { validate, sanitize } from '@/schema/auth/password-reset'
import type { VerificationCodeSubmitTokenPayload } from './verification-code-submit/types'
import { createPasswordHash, decodeAuthKeySignedToken } from './util'
import { testRateLimiter } from '@/server/services/rate-limiter'
import { getRolesAndPermissionsFromUser } from '#framework/auth/roles-and-permissions'
import { createAuthToken } from '#framework/auth/auth-token'
import { updateDirectly } from '@/server/framework/database/write/update'
import { readDirectly } from '@/server/framework/database/read'

export const Auth_passwordReset: MutationResolvers['Auth_passwordReset'] =
  async (_, { input: _input }, { setAuthToken }) => {
    const errors = validate(_input)
    if (errors) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: 'VALIDATION_FAIL', errors },
      })
    }

    const { newPassword, verificationCodeSubmitToken } = sanitize(_input)

    let verificationCodeSubmitTokenPayload: VerificationCodeSubmitTokenPayload
    try {
      verificationCodeSubmitTokenPayload = await decodeAuthKeySignedToken(
        verificationCodeSubmitToken,
      )
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.name === `TokenExpiredError`) {
        throw new GraphQLError(`verification time expired`, {
          extensions: { code: PasswordResetError.VerificationTimeExpired },
        })
      }
      throw e
    }

    const {
      data: {
        //      requestId,
        method, // you can proceed with the given method!
        state,
        createdAtMilliseconds, // this will be checked at the server.
        authId, // you can use this phone number!
      },
    } = verificationCodeSubmitTokenPayload

    if (method !== AuthMethod.PasswordReset) {
      throw new GraphQLError(`Invalid method`, {
        extensions: { code: PasswordResetError.InvalidMethod },
      })
    }

    if (state !== VerificationCodeState.VerificationCodeSubmit) {
      throw new GraphQLError(`Invalid state`, {
        extensions: { code: PasswordResetError.InvalidState },
      })
    }

    if (createdAtMilliseconds + 20 * 60 * 1000 < Date.now()) {
      throw new GraphQLError(`verification time expired`, {
        extensions: { code: PasswordResetError.VerificationTimeExpired },
      })
    }

    // acquire two locks! 5 per 5 sec lock
    const shortLockAcquired = await testRateLimiter(
      `password-reset-per-sec:${authId}`,
      5,
      5 * 1000,
    )

    if (!shortLockAcquired) {
      throw new GraphQLError(`rate limited`, {
        extensions: { code: PasswordResetError.RateLimited },
      })
    }

    // acquire two locks! 10 per 60 sec lock
    const longLockAcquired = await testRateLimiter(
      `password-reset-total:${authId}`,
      10,
      60 * 1000,
    )

    if (!longLockAcquired) {
      throw new GraphQLError(`rate limited`, {
        extensions: { code: PasswordResetError.RateLimited },
      })
    }
    //

    const pwhash = await createPasswordHash(newPassword)

    await updateDirectly<AuthAccount>(`/auth-accounts/${authId}`, {
      pwhash,
    })

    const authAccount = await readDirectly<AuthAccount>(
      `/auth-accounts/${authId}`,
    )

    if (!authAccount || authAccount.revoked) {
      throw new GraphQLError(`account not exists`, {
        extensions: { code: PasswordResetError.AccountNotExists },
      })
    }

    const { defaultUserId } = authAccount
    const user = await readDirectly<User>(`/users/${defaultUserId}`)
    if (!user) {
      throw new GraphQLError(`user not found!`, {
        extensions: { code: 'USER_NOT_FOUND' },
      })
    }

    const rolesAndPermissions = getRolesAndPermissionsFromUser(user)
    const { token: authToken } = await createAuthToken({
      userId: defaultUserId,
      rolesAndPermissions,
    })

    setAuthToken(authToken)

    return {
      user,
    }
  }
