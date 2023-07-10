import http from 'http'
import https from 'https'
import fs from 'fs'
import { EventEmitter } from 'events'
import { app } from './app'
import next from 'next'

EventEmitter.defaultMaxListeners = 100

// https://nextjs.org/docs/pages/building-your-application/configuring/custom-server

// on production only http port is used!
const port = process.env.PORT ? Number(process.env.PORT) : undefined
if (!port) {
  throw new Error(`PORT not provided!`)
}

const dev = process.env.NODE_ENV !== 'production'
/* provide HOST_NAME in dev environments! */
const hostname = process.env.HOST_NAME || 'localhost'
const nextApp = next({ dev, hostname, port })

await nextApp.prepare()

const handler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url) {
    const url = new URL(req.url, `https://${hostname}`)
    if (url.pathname.indexOf(`/api`) === 0) {
      // route express
      app(req, res)
    } else {
      // route next
      await nextApp.render(
        req,
        res,
        url.pathname,
        Object.fromEntries(url.searchParams),
      )
    }
  }
}

// used for dev
const certPath = process.env.CERT || undefined
const certKeyPath = process.env.CERT_KEY || undefined
const isHTTPS = !!certPath
console.log(`hostname : ${hostname} port : ${port} isHTTPS: ${isHTTPS} `)
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

  https.createServer(options, handler).listen(port)
} else {
  http.createServer(handler).listen(port)
}
