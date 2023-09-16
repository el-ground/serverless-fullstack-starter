import { asyncHandler } from '#framework/express'
import { create as createUuid } from '#util/uuid'
/*
    requires cookie-parser
*/
/*
    If sid provided, attach it to res.
    if sid not provided, set cookie and attach to res.
    Make sure to attach cookies to everyone!!! :) awesome :)
*/
export const sessionIdCookieMiddleware = () =>
  asyncHandler(async (req, res, next) => {
    let sessionId = req.cookies?.sid || ``

    if (sessionId) {
      // attach to res, go on.
    } else {
      // create sid.

      sessionId = createUuid(20)
      res.cookie(`sid`, sessionId, {
        secure: true,
        httpOnly: true,
        // PRIVACY
        // track for sufficiently long time
        maxAge: 200 * 365 * 24 * 60 * 60,
      })
    }

    req.sessionId = sessionId
    next()
  })
