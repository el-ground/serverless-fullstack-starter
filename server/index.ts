import http from 'http'
import https from 'https'
import fs from 'fs'
import { EventEmitter } from 'events'
import { app as expressApp } from './app'
import { createRouter as createApolloRouter } from './framework/apollo'
import { createApp as createNextApp } from '@/server/framework/next'
EventEmitter.defaultMaxListeners = 100

// https://nextjs.org/docs/pages/building-your-application/configuring/custom-server

const port = process.env.PORT ? Number(process.env.PORT) : 3000
/* provide HOST_NAME in dev environments! */
const hostname = process.env.HOST_NAME || 'localhost'

const nextApp = await createNextApp()

/*
  This way, express / next / apollo doesn't share any middlewares!
*/

const handler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url) {
    const url = new URL(
      req.url,
      `https://${req.headers.host || `${hostname}:${port}`}`,
    )
    if (url.pathname.indexOf(`/api`) === 0) {
      expressApp(req, res)
    } else {
      nextApp(url, req, res)
    }
  }
}

let server: http.Server | https.Server

// used for dev
const certPath = process.env.CERT || undefined
const certKeyPath = process.env.CERT_KEY || undefined
const isHTTPS = process.env.SECURE === `true`
console.log(
  `NODE_ENV: ${process.env.NODE_ENV} hostname : ${hostname} port : ${port} isHTTPS: ${isHTTPS} `,
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

  server = https.createServer(options, handler)
} else {
  server = http.createServer(handler)
}

// bind apollo to express app
const apolloRouter = await createApolloRouter(server)
expressApp.use(`/api/graphql`, apolloRouter)
server.listen(port)
