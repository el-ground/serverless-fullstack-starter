import { GraphQLError } from 'graphql'
import type { AuthMutationsResolvers } from '@/schema/__generated__/server/types'
import { validate, sanitize } from '@/schema/auth/verification-code-submit'

export const verificationCodeSubmit: AuthMutationsResolvers['verificationCodeSubmit'] =
  async (_, { input: _input }, { loader }) => {
    if (validate(_input)) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: 'VALIDATION_FAIL' },
      })
    }

    const { verificationCodeRequestToken, verificationCode } = sanitize(_input)

    return {
      verificationCodeSubmitToken: `verificationCodeSubmitToken`,
    }
  }
