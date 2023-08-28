import type { RolesAndPermissions } from '../roles-and-permissions'

// TODO : need mechanism to compare auth token's version and
// current deployments' auth token version and
// revoke if version is different
export interface AuthTokenPayload {
  userId: string
  authId: string
  refreshTokenId: string
  rolesAndPermissions: RolesAndPermissions
  version: string
}

export interface RefreshToken {
  userId: string
  authId: string
  revoked: boolean
  revokedAtSeconds?: number
  expiresAtSeconds: number
  createdAtSeconds: number
}
