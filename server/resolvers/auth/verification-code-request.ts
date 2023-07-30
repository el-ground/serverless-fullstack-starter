import { GraphQLError } from 'graphql'
import type { AuthMutationsResolvers } from '@/schema/__generated__/server/types'
import { validate, sanitize } from '@/schema/auth/verification-code-request'

export const verificationCodeRequest: AuthMutationsResolvers['verificationCodeRequest'] =
  async (_, { input: _input }, { loader }) => {
    if (validate(_input)) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: 'VALIDATION_FAIL' },
      })
    }

    const { method, verificationService, authId } = sanitize(_input)

    return {
      verificationCodeRequestToken: `verificationCodeRequestToken`,
    }
  }
