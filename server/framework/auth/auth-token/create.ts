import { create as createUUID } from '#util/uuid'
import { getAuthKey } from '#framework/auth/key'
import type { AuthTokenPayload, RefreshToken } from './types'
import type { RolesAndPermissions } from '../roles-and-permissions'
import { getRolesAndPermissionsFromUser } from '../roles-and-permissions'
import jwt from 'jsonwebtoken'
import { runTransaction } from '../../database/transaction'
import { updateInTransaction } from '#framework/database/write/update'
import { createInTransaction } from '#framework/database/write/create'

export const createAuthToken = async ({
  userId,
  rolesAndPermissions,
  refreshTokenId: _refreshTokenId,
  refreshTokenIdToRevoke,
}: {
  userId: string
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
      const currentTimeSeconds = Math.floor(Date.now() / 1000)
      if (refreshTokenIdToRevoke) {
        // revokeRefreshToken
        updateInTransaction<RefreshToken>(
          `/refresh-tokens/${refreshTokenIdToRevoke}`,
          {
            revoked: true,
            revokedAtSeconds: currentTimeSeconds,
          },
          transaction,
        )
      }

      createInTransaction<RefreshToken>(
        `/refresh-tokens/${refreshTokenId}`,
        {
          userId,
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
    rolesAndPermissions,
    refreshTokenId,
    version: `1.0.0`,
  }

  const token = jwt.sign(payload, getAuthKey(), {
    expiresIn: '1h',
    jwtid,
    algorithm: 'RS256',
  })

  return {
    token,
    payload,
  }
}