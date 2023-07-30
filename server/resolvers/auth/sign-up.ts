import { GraphQLError } from 'graphql'
import type {
  AuthMutationsResolvers,
  User,
} from '@/schema/__generated__/server/types'
import { validate, sanitize } from '@/schema/auth/sign-up'

export const signUp: AuthMutationsResolvers['signUp'] = async (
  _,
  { input: _input },
  { loader, setAuthToken },
) => {
  if (validate(_input)) {
    throw new GraphQLError(`validation error!`, {
      extensions: { code: 'VALIDATION_FAIL' },
    })
  }

  const {
    authId,
    password,
    nickname,
    accountType,
    verificationCodeSubmitToken,
  } = sanitize(_input)

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
