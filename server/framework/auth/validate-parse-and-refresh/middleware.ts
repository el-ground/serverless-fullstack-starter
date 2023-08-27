import { asyncHandler } from '@/server/framework/express'
import { splitJWT } from './util'
import { refreshTokenDurationSeconds } from '../config'
import { validateParseAndRefresh } from '.'

/*
    requires cookie-parser
*/

const isHTTPS = process.env.SECURE === `true`
const secure = process.env.NODE_ENV === `development` ? isHTTPS : true

export const validateParseAndRefreshAuthCookiesMiddleware = ({
  refresh,
}: {
  refresh: boolean
}) =>
  asyncHandler(async (req, res, next) => {
    const authorizationPayloadCookie =
      req.cookies?.[`authorization-payload`] || ``
    const authorizationRestCookie = req.cookies?.[`authorization-rest`] || ``

    const authToken = authorizationPayloadCookie + authorizationRestCookie

    // can be used to update auth status when signin
    const setAuthToken = (token: string | null) => {
      if (token) {
        const { payload, rest } = splitJWT(token)

        res.cookie('authorization-payload', payload, {
          secure,
          maxAge: refreshTokenDurationSeconds,
        })
        res.cookie(`authorization-rest`, rest, {
          secure,
          httpOnly: true, // set to http to prevent forgery
          maxAge: refreshTokenDurationSeconds,
        })
      } else {
        // if called with empty token, cookie delete
        res.clearCookie('authorization-payload')
        res.clearCookie('authorization-rest')
      }
    }
    res.setAuthToken = setAuthToken

    // favor header over cookie
    const { refreshedToken, authPayload } = await validateParseAndRefresh(
      authToken,
      refresh,
    )

    if (refreshedToken) {
      // if used cookie, update using cookie!
      setAuthToken(refreshedToken)
    } else if (authToken && !authPayload.isAuthenticated) {
      setAuthToken(null)
    }

    next()
  })
