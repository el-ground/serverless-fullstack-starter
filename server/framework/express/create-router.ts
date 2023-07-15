import { Router } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'
import { requestId } from './middlewares/request-id'
import { logInfo } from './middlewares/logger'
import { errorHandler } from './middlewares/error-handler'
import { rootRouter } from '@/server/routers'

/* 
    Binds routers and handlers to given express app.
*/
export const createRouter = ({
  corsAllowOrigins,
}: {
  corsAllowOrigins?: string[]
}) => {
  const router = Router()
  /*
        1. request id log
    */
  router.use(requestId())

  router.use(
    morgan('[:date[iso]] Started :method :url for :remote-addr', {
      immediate: true,
      stream: {
        write: logInfo,
      },
    }),
  )

  router.use(
    morgan(
      '[:date[iso]] Completed :status :res[content-length] in :response-time ms',
      {
        stream: {
          write: logInfo,
        },
      },
    ),
  )

  /*
        2. allow CORS
    */
  if (corsAllowOrigins && corsAllowOrigins.length > 0) {
    const corsOptions = {
      origin: corsAllowOrigins,
    }

    router.use(cors(corsOptions))
  }

  /*
        compression
    */
  router.use(compression())

  router.get([`/`, `/healthy`, `/ping`], (req, res) => {
    res.status(200)
    res.send(`healthy!`)
  })

  router.use(rootRouter)
  router.use(errorHandler())

  return router
}
