/* customize for your own needs! */
import express, { Router } from 'express'
import ip from 'ip'
import { bind } from './framework/express'
import { exampleRouter } from './routers/example'
import { initialize as initializeRequestId } from './framework/express/middlewares/request-id'
import { initialize as intiializeLogger } from './framework/express/middlewares/logger'

initializeRequestId()
intiializeLogger()

const app = express()
const mainRouter = Router()
// on production only http port is used!
const port = process.env.PORT ? Number(process.env.PORT) : undefined

// enable cors while development!
const corsAllowOrigins = []
if (process.env.NODE_ENV === `development`) {
  const address = ip.address()

  corsAllowOrigins.push(
    `http://localhost:${port}`,
    `http://${address}:${port}`,
    `https://localhost:${port}`,
    `https://${address}:${port}`,
  )
}

// bind routers
bind(mainRouter, [exampleRouter], {
  corsAllowOrigins,
})

app.use(`/api/`, mainRouter)

export { app }
