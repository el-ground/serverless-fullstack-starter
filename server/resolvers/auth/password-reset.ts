import { GraphQLError } from 'graphql'
import type { AuthMutationsResolvers, User } from '#/types'
import { validate, sanitize } from '@/schema/auth/password-reset'

export const passwordReset: AuthMutationsResolvers['passwordReset'] = async (
  _,
  { input: _input },
  { loader, setAuthToken },
) => {
  if (validate(_input)) {
    throw new GraphQLError(`validation error!`, {
      extensions: { code: 'VALIDATION_FAIL' },
    })
  }

  const { newPassword, verificationCodeSubmitToken } = sanitize(_input)

  const user = await loader.load<User>(`a`)
  if (!user) {
    throw new GraphQLError(`user not found!`, {
      extensions: { code: 'USER_NOT_FOUND' },
    })
  }

  setAuthToken(`hello world!`)

  return {
    user,
  }
}
