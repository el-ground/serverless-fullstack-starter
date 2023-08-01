import type { RolesAndPermissions } from './roles-and-permissions'

export interface AuthPayload {
  userId?: string
  isAuthenticated: boolean
  rolesAndPermissions?: RolesAndPermissions
}
