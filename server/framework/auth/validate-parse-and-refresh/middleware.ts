import { asyncHandler } from '#framework/express'
import { getSetAuthToken, splitJWT } from './util'
import { replaceCookiesInRequest } from '#framework/express/middlewares/replace-cookies-header'
import { validateParseAndRefresh } from '.'

/*
    requires cookie-parser
*/

export const validateParseAndRefreshAuthCookiesMiddleware = () =>
  asyncHandler(async (req, res, next) => {
    const authorizationPayloadCookie =
      req.cookies?.[`authorization-payload`] || ``
    const authorizationRestCookie = req.cookies?.[`authorization-rest`] || ``

    const authToken = authorizationPayloadCookie + authorizationRestCookie

    // can be used to update auth status when signin
    const setAuthToken = getSetAuthToken(
      res.cookie.bind(res),
      res.clearCookie.bind(res),
    )

    res.setAuthToken = setAuthToken

    // favor header over cookie
    const { refreshedToken, authPayload } =
      await validateParseAndRefresh(authToken)

    req.auth = authPayload

    if (refreshedToken) {
      /*
        DANGEROUS : 
        1. update cookies in the header;
        2. update cookies in the cookie-parsed object
      */
      const { payload, rest } = splitJWT(refreshedToken)
      replaceCookiesInRequest(req, `authorization-payload`, payload)
      replaceCookiesInRequest(req, `authorization-rest`, rest)

      // if used cookie, update using cookie!
      setAuthToken(refreshedToken)
    } else if (authToken && !authPayload.isAuthenticated) {
      /*
        If token exists, it must be authenticated.
        Being not authenticated means the token is malformed or cannot validate or etc.
      */
      replaceCookiesInRequest(req, `authorization-payload`, null)
      replaceCookiesInRequest(req, `authorization-rest`, null)

      setAuthToken(null)
    }

    next()
  })
