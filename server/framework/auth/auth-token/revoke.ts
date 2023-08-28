import { Transaction } from '../../database/transaction'
import {
  updateDirectly,
  updateInTransaction,
} from '../../database/write/update'
import type { AuthAccount } from '../auth-account'
import type { RefreshToken } from './types'

// might return not found error
export const revokeRefreshToken = async (refreshTokenId: string) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  // refreshToken also revoked inside ./create.ts

  return updateDirectly<RefreshToken>(`/refresh-tokens/${refreshTokenId}`, {
    revoked: true,
    revokedAtSeconds: currentTimeSeconds,
  })
}

export const revokeRefreshTokenInTransaction = (
  refreshTokenId: string,
  transaction: Transaction,
) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  updateInTransaction<RefreshToken>(
    `/refresh-tokens/${refreshTokenId}`,
    {
      revoked: true,
      revokedAtSeconds: currentTimeSeconds,
    },
    transaction,
  )
}

export const revokeAuthAccountInTransaction = async (
  authId: string,
  transaction: Transaction,
) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  updateInTransaction<AuthAccount>(
    `/auth-accounts/${authId}`,
    {
      revoked: true,
      revokedAtSeconds: currentTimeSeconds,
    },
    transaction,
  )
}
