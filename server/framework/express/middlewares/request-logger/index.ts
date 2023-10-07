import type { Request, Router } from 'express'
import { getRequestIpAddress } from '#util/ip'

/*
  TODO : get rid of morgan. we don't need it;
*/
import { logInfo } from '../logger'
import morgan from 'morgan'
import { asyncHandler } from '#framework/express'

export const setupRequestLogger = (app: Router) => {
  morgan.token('uid', function (req: Request) {
    return req.auth?.userId || `ANONYMOUS`
  })

  morgan.token('sid', function (req: Request) {
    return req.sessionId || ``
  })

  morgan.token(`ip`, function (req: Request) {
    return getRequestIpAddress(req)
  })

  // just to escape colon :)
  morgan.token(`START`, () => `:START`)
  morgan.token(`COMPLETE`, () => `:COMPLETE`)

  app.use(
    morgan(
      'step:[HT:START] ip:[:remote-addr] date:[:date[iso]] method:[:method] url:[:url] referrer:[:referrer] user-agent:[:user-agent]',
      {
        immediate: true,
        stream: {
          write: logInfo,
        },
      },
    ),
  )

  app.use(
    morgan(
      'step:[HT:COMPLETE] sid:[:sid] uid:[:uid] ip:[:remote-addr] date:[:date[iso]] duration:[:response-time] status:[:status] content-length:[:res[content-length]]',
      {
        stream: {
          write: logInfo,
        },
      },
    ),
  )
}

export const logIdentifiers = () =>
  asyncHandler(async (req, res, next) => {
    const userId = req.auth?.userId || `ANONYMOUS`
    const sessionId = req.sessionId
    const ip = req.ip

    logInfo(`step:[HT:IDENTIFY] sid:[${sessionId}] uid:[${userId}] ip:[${ip}]`)
    next()
  })
