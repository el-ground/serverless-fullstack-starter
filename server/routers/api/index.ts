import { Router } from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import { sessionIdCookieMiddleware } from '@/server/framework/session'
import { errorHandler } from '#framework/express/middlewares/error-handler'
import { logIdentifiers } from '#framework/express/middlewares/request-logger'
import { fileUploadRouter } from './upload-file'
import { exampleRouter } from './example'

/*
    Define REST API here!
*/

const restAPIRouter = Router()

restAPIRouter.use((req, res, next) => {
  res.set(`Cache-Control`, `no-store`)
  next()
})
restAPIRouter.use(compression()) // gzip
restAPIRouter.use(cookieParser()) // required to parse auth
restAPIRouter.use(sessionIdCookieMiddleware()) // required to parse auth
restAPIRouter.use(validateParseAndRefreshAuthCookiesMiddleware()) // auth middleware. auto refresh
restAPIRouter.use(logIdentifiers())

restAPIRouter.get([`/`, `/healthy`, `/ping`], (req, res) => {
  res.status(200)
  res.send(`healthy!`)
})

// log when sessionId and authId attached!
restAPIRouter.use(fileUploadRouter)
restAPIRouter.use(exampleRouter)
/*
    This file should get fat as more routers are added. :)
*/

restAPIRouter.use(errorHandler())

export { restAPIRouter }
