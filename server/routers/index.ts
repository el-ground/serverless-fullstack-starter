import { Router } from 'express'
import { exampleRouter } from './example'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import cookieParser from 'cookie-parser'

const rootRouter = Router()

rootRouter.use(cookieParser()) // required to parse auth
rootRouter.use(validateParseAndRefreshAuthCookiesMiddleware({ refresh: true })) // auth middleware. auto refresh

rootRouter.use(exampleRouter)
/*
    This file should get fat as more routers are added. :)
*/

export { rootRouter }
