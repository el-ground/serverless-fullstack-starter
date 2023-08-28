import type { RolesAndPermissions } from './roles-and-permissions'

export interface AuthPayload {
  userId?: string
  authId?: string
  refreshTokenId?: string
  isAuthenticated: boolean
  rolesAndPermissions?: RolesAndPermissions
}
