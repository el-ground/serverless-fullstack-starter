import { create as createUUID } from '#util/uuid'
import { getAuthKeyStringRSA4096Private } from '#framework/auth/key'
import type { AuthTokenPayload, RefreshToken } from './types'
import type { RolesAndPermissions } from '../roles-and-permissions'
import jwt from 'jsonwebtoken'
import { runTransaction } from '../../database/transaction'
import { revokeRefreshTokenInTransaction } from './revoke'
import { updateInTransaction } from '#framework/database/write/update'
import { createInTransaction } from '#framework/database/write/create'

export const createAuthToken = async ({
  userId,
  authId,
  rolesAndPermissions,
  refreshTokenId: _refreshTokenId,
  refreshTokenIdToRevoke,
}: {
  userId: string
  authId: string
  rolesAndPermissions: RolesAndPermissions
  refreshTokenId?: string
  refreshTokenIdToRevoke?: string
}) => {
  const jwtid = createUUID(20)

  let refreshTokenId: string

  if (_refreshTokenId) {
    refreshTokenId = _refreshTokenId
  } else {
    refreshTokenId = createUUID(20)

    /*
      0. in transaction,
      1. try revoke refresh token of id : refreshTokenIdTokRevoke
      2. create new refreshTokenId
      3. create refreshToken of id : refreshTokenId
    */

    await runTransaction(async (transaction) => {
      if (refreshTokenIdToRevoke) {
        // revokeRefreshToken
        revokeRefreshTokenInTransaction(refreshTokenIdToRevoke, transaction)
      }

      const currentTimeSeconds = Math.floor(Date.now() / 1000)
      createInTransaction<RefreshToken>(
        `/refresh-tokens/${refreshTokenId}`,
        {
          userId,
          authId,
          createdAtSeconds: currentTimeSeconds,
          revoked: false,
          expiresAtSeconds: currentTimeSeconds + 90 * 24 * 60 * 60,
          // default 9 days expire
        },
        transaction,
      )
    })
  }

  const payload: AuthTokenPayload = {
    userId,
    authId,
    rolesAndPermissions,
    refreshTokenId,
    version: `1.0.0`,
  }

  const token = jwt.sign(payload, getAuthKeyStringRSA4096Private(), {
    expiresIn: '1h',
    jwtid,
    algorithm: 'RS256',
  })

  return {
    token,
    payload,
  }
}
