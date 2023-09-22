import { AuthTokenPayload } from '#framework/auth/auth-token/types'
import { AuthPayload } from '#framework/auth'
import { getCookies } from '@util/cookie'

export const getAuthPayloadFromCookieString = (
  authorizationPayloadCookie?: string,
) => {
  let authPayload: AuthPayload = {
    isAuthenticated: false,
  }

  if (authorizationPayloadCookie) {
    /*
        To Check :
        1. format (version, parse)
        2. time
        
        if any fail, clear the cookie!
    */
    try {
      const authTokenPayload = JSON.parse(
        atob(authorizationPayloadCookie.split(`.`)[1]),
      ) as AuthTokenPayload

      authPayload = {
        userId: authTokenPayload.userId,
        isAuthenticated: true,
        rolesAndPermissions: authTokenPayload.rolesAndPermissions,
      }
    } catch (e) {
      console.error(e)
    }
  }

  return authPayload
}

export const getAuthDependencies = () => {
  const [sidCookie, authorizationPayloadCookie] = getCookies([
    `sid`,
    `authorization-payload`,
  ])

  const authPayload = getAuthPayloadFromCookieString(authorizationPayloadCookie)

  return {
    sidCookie,
    authorizationPayloadCookie,
    authPayload,
  }
}
