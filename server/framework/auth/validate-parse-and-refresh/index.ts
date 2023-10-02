import type { AuthPayload } from '../auth-payload'
import {
  decodeAuthTokenNoRefresh,
  decodeAuthTokenTryRefresh,
} from '../auth-token/decode'
import { logError } from '#util/log'
/*
    1. on header get,
        check jwt and validate, populate data and return.
        if upgradable, upgrade and return new token.
        can we upgrade on rsc? => need to go for cookies based solution!
            check cookies -> set-cookie
        
        https://nextjs.org/docs/app/api-reference/functions/cookies
        
        we set handler to the apollo


*/
/*
  Called on every endpoints that requires auth.
  1. express
  2. next ssr
  3. apollo
*/

// https://stackoverflow.com/questions/52574099/security-of-storing-bearer-token-in-cookies

export const validateAndParse = (authToken: string): AuthPayload => {
  try {
    if (authToken) {
      const { payload } = decodeAuthTokenNoRefresh(authToken)

      return {
        userId: payload.userId,
        authId: payload.authId,
        refreshTokenId: payload.refreshTokenId,
        isAuthenticated: true,
        rolesAndPermissions: payload.rolesAndPermissions,
      }
    }
  } catch (e) {
    logError(e)
  }

  return {
    isAuthenticated: false,
  }
}

export const validateParseAndRefresh = async (
  authToken: string,
): Promise<{
  refreshedToken?: string
  authPayload: AuthPayload
}> => {
  // jwt stuff. get rolesAndPermissions.

  try {
    if (authToken) {
      const { token, payload, refreshed } =
        await decodeAuthTokenTryRefresh(authToken)

      return {
        refreshedToken: refreshed ? token : undefined,
        authPayload: {
          userId: payload.userId,
          authId: payload.authId,
          refreshTokenId: payload.refreshTokenId,
          isAuthenticated: true,
          rolesAndPermissions: payload.rolesAndPermissions,
        },
      }
    }
  } catch (e) {
    logError(e)
    // auth expire!
  }

  return {
    authPayload: {
      isAuthenticated: false,
    },
  }
}
