import express, { Router } from 'express'
import { bind } from './framework/express'
import { initialize as initializeRequestId } from './framework/express/middlewares/request-id'
import { initialize as intiializeLogger } from './framework/express/middlewares/logger'

initializeRequestId()
intiializeLogger()

const app = express()
const mainRouter = Router()

// enable cors while development!

// bind routers
bind(mainRouter, {
  corsAllowOrigins: [],
})

app.use(`/api/`, mainRouter)

/*
  use this app for supertest!
*/
export { app }
