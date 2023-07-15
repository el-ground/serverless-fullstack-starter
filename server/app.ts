import express from 'express'
import { createRouter } from './framework/express'
import { initialize as initializeRequestId } from './framework/express/middlewares/request-id'
import { initialize as intiializeLogger } from './framework/express/middlewares/logger'
import { getCORSAllosOrigins } from '@/config'

initializeRequestId()
intiializeLogger()

const app = express()
const mainRouter = createRouter({
  corsAllowOrigins: [...getCORSAllosOrigins()],
})

app.use(`/api/`, mainRouter)

/*
  use this app for supertest!
*/
export { app }
