import type { RolesAndPermissions } from '../roles-and-permissions'

export interface AuthTokenPayload {
  userId: string
  rolesAndPermissions: RolesAndPermissions
  refreshTokenId: string
  version: string
}

export interface RefreshToken {
  userId: string
  revoked: boolean
  revokedAtSeconds?: number
  expiresAtSeconds: number
  createdAtSeconds: number
}
