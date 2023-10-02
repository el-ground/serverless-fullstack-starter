import express from 'express'
import { restAPIRouter } from './routers/api'
import { requestId } from './framework/express/middlewares/request-id'
import { setupRequestLogger } from './framework/express/middlewares/request-logger'
import { mediaServeRouter } from './routers/media/serve'

// https://stackoverflow.com/a/14631683

const app = express()
// attach requestId per express request
app.use(requestId())
setupRequestLogger(app)

// REST API router
app.use(`/api/rest/`, restAPIRouter)
app.use(`/m/`, mediaServeRouter)

// Also apollo router going to attach to this app.

/*
  use this app for supertest!
*/
export { app }
