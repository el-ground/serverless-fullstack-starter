import type { MutationResolvers } from '#types'
import { GraphQLError } from 'graphql'
import { revokeRefreshToken } from '#framework/auth/auth-token/revoke'
import { UNAUTHORIZED } from '#types/common-errors'

export const Auth_logOut: MutationResolvers['Auth_logOut'] = async (
  _,
  __,
  { isAuthenticated, setAuthToken, refreshTokenId },
) => {
  if (!isAuthenticated) {
    throw new GraphQLError(`Unauthorized`, {
      extensions: { code: UNAUTHORIZED },
    })
  }

  if (!refreshTokenId) {
    // should be present in all authenticated environments
    throw new Error(`Refresh token not found`)
  }

  await revokeRefreshToken(refreshTokenId)

  setAuthToken(null)
  return true
}
