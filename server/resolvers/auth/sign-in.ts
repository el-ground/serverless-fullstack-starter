import { GraphQLError } from 'graphql'
import type { AuthMutationsResolvers, User } from '#types'
import { SignInError } from '#types'
import bcrypt from 'bcrypt'
import { validate, sanitize } from '@/schema/auth/sign-in'
import { getRolesAndPermissionsFromUser } from '#framework/auth/roles-and-permissions'
import { createAuthToken } from '#framework/auth/auth-token'
import { testRateLimiter } from '@/server/services/rate-limiter'
import { readDirectly } from '@/server/framework/database/read'
import { AuthAccount } from '@/server/framework/auth/auth-account'

export const signIn: AuthMutationsResolvers['signIn'] = async (
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

  const { authId, password } = sanitize(_input)

  // 5 per 5 sec lock
  const lockAcquired = await testRateLimiter(
    `signin-per-sec:${authId}`,
    5,
    5 * 1000,
  )

  if (!lockAcquired) {
    throw new GraphQLError(`rate limited`, {
      extensions: { code: SignInError.RateLimited },
    })
  }

  const authAccount = await readDirectly<AuthAccount>(
    `/auth-accounts/${authId}`,
  )
  if (!authAccount) {
    throw new GraphQLError(`Invalid password or user doesn't exist`, {
      extensions: { code: SignInError.InvalidPasswordOrUserDoesntExist },
    })
  }

  const { defaultUserId, pwhash } = authAccount

  const isValid = await bcrypt.compare(password, pwhash)
  if (!isValid) {
    throw new GraphQLError(`Invalid password or user doesn't exist`, {
      extensions: { code: SignInError.InvalidPasswordOrUserDoesntExist },
    })
  }

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
