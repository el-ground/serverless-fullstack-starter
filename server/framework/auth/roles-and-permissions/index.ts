import { User } from '#types'

// move definition to somewhere else better.
export interface RolesAndPermissions {
  isAdmin: boolean
}

export const getRolesAndPermissionsFromUser = (user: User) => {
  const rolesAndPermissions: RolesAndPermissions = {
    isAdmin: user.private.isAdmin,
  }
  return rolesAndPermissions
}
