import { GraphQLError } from 'graphql'
import { validate, sanitize } from '@/schema/auth/auth-account-exists'
import type { QueryResolvers } from '#types'
import type { VerificationCodeSubmitTokenPayload } from './verification-code-submit/types'
import { AuthAccountExistsError, VerificationCodeState } from '#types'
import { decodeAuthKeySignedToken } from './util'
import { readDirectly } from '@/server/framework/database/read'
import { AuthAccount } from '@/server/framework/auth/auth-account'
import { VALIDATION_FAIL } from '#types/common-errors'

export const Auth_authAccountExists: QueryResolvers['Auth_authAccountExists'] =
  async (_, { input: _input }) => {
    const errors = validate(_input)
    if (errors) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: VALIDATION_FAIL, errors },
      })
    }

    const { verificationCodeSubmitToken } = sanitize(_input)

    let verificationCodeSubmitTokenPayload: VerificationCodeSubmitTokenPayload
    try {
      verificationCodeSubmitTokenPayload = await decodeAuthKeySignedToken(
        verificationCodeSubmitToken,
      )
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.name === `TokenExpiredError`) {
        throw new GraphQLError(`verification time expired`, {
          extensions: { code: AuthAccountExistsError.VerificationTimeExpired },
        })
      }
      throw e
    }

    const {
      data: { state, authId, createdAtMilliseconds },
    } = verificationCodeSubmitTokenPayload

    if (state !== VerificationCodeState.VerificationCodeSubmit) {
      throw new GraphQLError(`Invalid state`, {
        extensions: { code: AuthAccountExistsError.InvalidState },
      })
    }

    if (createdAtMilliseconds + 20 * 60 * 1000 < Date.now()) {
      throw new GraphQLError(`verification time expired`, {
        extensions: { code: AuthAccountExistsError.VerificationTimeExpired },
      })
    }

    const authAccount = await readDirectly<AuthAccount>(
      `/auth-accounts/${authId}`,
    )
    const exists = !!(authAccount && !authAccount.revoked)

    return {
      exists,
      sanitizedAuthId: authId,
    }
  }
