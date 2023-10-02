import http from 'http'
import https from 'https'
import fs from 'fs'
import express from 'express'
import { app as expressApp } from './app'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { createRouter as createApolloRouter } from './framework/apollo'
import { createApp as createNextApp } from '@/server/framework/next'

// https://nextjs.org/docs/pages/building-your-application/configuring/custom-server

const port = process.env.PORT ? Number(process.env.PORT) : 3000

const nextPort = port + 1
const nextApp = await createNextApp(nextPort)
const nextServer = http.createServer(nextApp)
console.log(`Next server port : ${nextPort}`)

// main route
const app = express()
// to know ip address; trust x-forwarded-for
app.set('trust proxy', true)

/*
  Next does nasty stuff to websocket, so we need to split the http server.
  We're not using hmr websocket.
*/
const nextProxyMiddleware = createProxyMiddleware({
  target: `http://localhost:${nextPort}`,
})

// route between next and our express app
app.use((req, res, next) => {
  if (req.url.indexOf(`/api/`) === 0 || req.url.indexOf(`/m/`) === 0) {
    expressApp(req, res, next)
  } else {
    nextProxyMiddleware(req, res, next)
  }
})

let server: http.Server | https.Server

// used for dev
const certPath = process.env.CERT || undefined
const certKeyPath = process.env.CERT_KEY || undefined
const isHTTPS = process.env.SECURE === `true`
console.log(
  `NODE_ENV: ${process.env.NODE_ENV} port : ${port} isHTTPS: ${isHTTPS} `,
)

if (isHTTPS) {
  if (!certPath) {
    throw new Error(`cert path : process.env.CERT not provided!`)
  }

  if (!certKeyPath) {
    throw new Error(`cert key path : process.env.CERT_KEY not provided!`)
  }

  const options = {
    key: fs.readFileSync(certKeyPath),
    cert: fs.readFileSync(certPath),
  }

  server = https.createServer(options, app)
} else {
  server = http.createServer(app)
}

// bind apollo to express app
const apolloRouter = await createApolloRouter(server)
expressApp.use(`/api/graphql`, apolloRouter)
nextServer.listen(nextPort)
server.listen(port)
