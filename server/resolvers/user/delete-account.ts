import type { MutationResolvers } from '#types'
import { GraphQLError } from 'graphql'
import {
  revokeRefreshTokenInTransaction,
  revokeAuthAccountInTransaction,
} from '#framework/auth/auth-token/revoke'
import { runTransaction } from '#framework/database/transaction'
import { UNAUTHORIZED } from '#types/common-errors'
import { deleteUserInTransaction } from '#model/user/delete-user'

export const User_deleteAccount: MutationResolvers['User_deleteAccount'] =
  async (
    _,
    __,
    { userId, authId, isAuthenticated, setAuthToken, refreshTokenId },
  ) => {
    //

    if (!isAuthenticated) {
      throw new GraphQLError(`Unauthorized`, {
        extensions: { code: UNAUTHORIZED },
      })
    }

    if (!refreshTokenId) {
      throw new Error(`Refresh token not found`)
    }

    if (!authId) {
      throw new Error(`AuthId not found`)
    }

    if (!userId) {
      throw new Error(`UserId not found`)
    }

    await runTransaction(async (transaction) => {
      await revokeRefreshTokenInTransaction(refreshTokenId, transaction)
      await revokeAuthAccountInTransaction(authId, transaction)
      await deleteUserInTransaction(userId, transaction)
    })

    setAuthToken(null)
    return true
  }
