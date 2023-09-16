import type { Request, Router } from 'express'

import { logInfo } from '../logger'
import morgan from 'morgan'
import { asyncHandler } from '#framework/express'

export const setupRequestLogger = (app: Router) => {
  morgan.token('uid', function (req: Request) {
    return req.auth?.userId || `ANONYMOUS`
  })

  morgan.token('sid', function (req: Request) {
    return req.sessionId
  })

  app.use(
    morgan(
      'ip:[:remote-addr] [:date[iso]] Started :method :url referrer:[:referrer"] user-agent:[:user-agent]',
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
      'sid:[:sid] uid:[:uid] ip:[:remote-addr] [:date[iso]] Completed :status :res[content-length] in :response-time ms',
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

    logInfo(`sid:[${sessionId}] uid:[${userId}] ip:[${ip}] Identified`)
    next()
  })
