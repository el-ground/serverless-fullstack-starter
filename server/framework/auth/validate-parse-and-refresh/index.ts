import type { AuthPayload } from '../auth-payload'
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

export const validateParseAndRefresh = async (
  authToken: string,
  refresh: boolean, // only validate and parse if refresh false.
): Promise<{
  refreshedToken?: string
  authPayload: AuthPayload
}> => {
  if (!authToken) {
    return {
      authPayload: {
        isAuthenticated: false,
        isAdmin: false,
      },
    }
  }

  // jwt stuff

  return {
    authPayload: {
      isAuthenticated: false,
      isAdmin: false,
    },
  }
}
