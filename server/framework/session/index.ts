import { asyncHandler } from '#framework/express'
import { replaceCookiesInRequest } from '#framework/express/middlewares/replace-cookies-header'
import { create as createUuid } from '#util/uuid'
/*
    requires cookie-parser
*/
/*
    If sid provided, attach it to res.
    if sid not provided, set cookie and attach to res.
    Make sure to attach cookies to everyone!!! :) awesome :)
*/

const isHTTPS = process.env.SECURE === `true`
const secure = process.env.NODE_ENV === `development` ? isHTTPS : true

export const sessionIdCookieMiddleware = () =>
  asyncHandler(async (req, res, next) => {
    let sessionId = req.cookies?.sid || ``

    if (sessionId) {
      // attach to res, go on.
    } else {
      // create sid.
      sessionId = createUuid(20)
      // replace sid to use in the following middlewares.
      replaceCookiesInRequest(req, `sid`, sessionId)

      res.cookie(`sid`, sessionId, {
        secure,
        httpOnly: true,
        // PRIVACY
        // track for sufficiently long time
        maxAge: 200 * 365 * 24 * 60 * 60,
      })
    }

    req.sessionId = sessionId
    next()
  })
