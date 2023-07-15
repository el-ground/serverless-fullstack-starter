import next from 'next'
import express from 'express'
import type { IncomingMessage, ServerResponse } from 'http'
import { asyncHandler } from '@/server/framework/express'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import cookieParser from 'cookie-parser'

// where is the NextServer type?
type NextServer = Awaited<ReturnType<typeof next>>

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const dev = process.env.NODE_ENV !== 'production'
/* provide HOST_NAME in dev environments! */
const hostname = process.env.HOST_NAME || 'localhost'

const createNextSSRRouteExpressWrapperApp = (nextServer: NextServer) => {
  const nextSSRRouteExpressWrapperApp = express()

  // https://expressjs.com/en/4x/api.html#app.settings.table
  // uses node's native querystring : https://nodejs.org/api/querystring.html#querystringparsestr-sep-eq-options
  nextSSRRouteExpressWrapperApp.set(`query parser`, `simple`)

  // prepare next

  /*
    Cookie update logic in front of next app handler
  */
  nextSSRRouteExpressWrapperApp.use(cookieParser())
  nextSSRRouteExpressWrapperApp.use(
    validateParseAndRefreshAuthCookiesMiddleware({
      refresh: true,
    }),
  )

  const nextAppHandler = asyncHandler(async (req, res) => {
    const query: Record<string, string> = {}
    // nextApp render only takes string query, so just eliminate other queries.
    Object.entries(req.query).forEach(([k, v]) => {
      if (typeof v === `string`) {
        query[k] = v
      } else if (Array.isArray(v)) {
        // if array, just take the first entry :)
        const value = v[0]
        if (typeof value === `string`) {
          query[k] = value
        }
      }
    })

    await nextServer.render(req, res, req.path, query)
  })

  nextSSRRouteExpressWrapperApp.use(nextAppHandler)
  return nextSSRRouteExpressWrapperApp
}

export const createApp = async () => {
  const nextServer = next({ dev, hostname, port })
  await nextServer.prepare()

  const nextExpressWrapperApp = createNextSSRRouteExpressWrapperApp(nextServer)

  const handler = async (
    url: URL,
    req: IncomingMessage,
    res: ServerResponse,
  ) => {
    if (url.pathname.includes(`.`)) {
      // resource with extension,

      return nextServer.render(
        req,
        res,
        url.pathname,
        Object.fromEntries(url.searchParams),
      )
    } else {
      // if no extension, this might be the ssr request.
      // check cookies for ssr request in order to use authentication
      return nextExpressWrapperApp(req, res)
    }
  }

  return handler
}
