import { Router } from 'express'
import compression from 'compression'
import { exampleRouter } from './example'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import { sessionIdCookieMiddleware } from '@/server/framework/session'
import cookieParser from 'cookie-parser'
import { errorHandler } from '#framework/express/middlewares/error-handler'
import { logIdentifiers } from '../framework/express/middlewares/request-logger'

/*
    Define REST API here!
*/

const restAPIRouter = Router()

restAPIRouter.use(compression())

restAPIRouter.use(cookieParser()) // required to parse auth
restAPIRouter.use(sessionIdCookieMiddleware()) // required to parse auth
restAPIRouter.use(
  validateParseAndRefreshAuthCookiesMiddleware({ refresh: true }),
) // auth middleware. auto refresh
restAPIRouter.use(logIdentifiers())

restAPIRouter.get([`/`, `/healthy`, `/ping`], (req, res) => {
  res.status(200)
  res.send(`healthy!`)
})

// log when sessionId and authId attached!

restAPIRouter.use(exampleRouter)
/*
    This file should get fat as more routers are added. :)
*/

restAPIRouter.use(errorHandler())

export { restAPIRouter }
