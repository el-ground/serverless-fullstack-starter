import { Router } from 'express'
import { errorHandler } from '#framework/express/middlewares/error-handler'
import { mediaServeRouter } from './serve'

const mediaRouter = Router()

// media router doesn't process auth, since most of them will be cached therefore only the cache miss request will be logged

mediaRouter.use(mediaServeRouter)

mediaRouter.use(errorHandler())

export { mediaRouter }
