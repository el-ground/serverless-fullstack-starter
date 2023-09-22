import next from 'next'
import express from 'express'
import type { RequestHandler } from 'next/dist/server/next'
import type { IncomingMessage, ServerResponse } from 'http'
// import { asyncHandler } from '#framework/express'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import { sessionIdCookieMiddleware } from '@/server/framework/session'
import cookieParser from 'cookie-parser'
import { getCacheHeader } from './get-cache-header'

const dev = process.env.NODE_ENV !== 'production'

const createNextSSRRouteExpressWrapperHandler = (
  nextServerRequestHandler: RequestHandler,
) => {
  const nextSSRRouteExpressWrapperApp = express()

  /*
    Cookie update logic in front of next app render handler
  */
  nextSSRRouteExpressWrapperApp.use(cookieParser())
  nextSSRRouteExpressWrapperApp.use(sessionIdCookieMiddleware())
  nextSSRRouteExpressWrapperApp.use(
    validateParseAndRefreshAuthCookiesMiddleware({
      refresh: true,
    }),
  )

  nextSSRRouteExpressWrapperApp.use((req, res) =>
    nextServerRequestHandler(req, res),
  )
  //  nextSSRRouteExpressWrapperApp.use(nextAppHandler)
  return nextSSRRouteExpressWrapperApp
}

export const createApp = async (port: number) => {
  const nextServer = next({ dev, port })
  await nextServer.prepare()

  const requestHandler = nextServer.getRequestHandler()

  const nextExpressWrapperHandler =
    createNextSSRRouteExpressWrapperHandler(requestHandler)

  const handler = async (req: IncomingMessage, res: ServerResponse) => {
    let useNextDefaultHandler = true
    if (req.url && !req.url.includes(`/_next/`)) {
      // path segment /foo/bar.ext
      const dotSplittedLastSegment =
        req.url.split(/[#?]/)[0].split('.').pop()?.trim() || ``
      const extensionExists =
        dotSplittedLastSegment && !dotSplittedLastSegment.includes(`/`)
      // extension exists!

      if (!extensionExists) {
        useNextDefaultHandler = false
      }
    }

    if (useNextDefaultHandler) {
      // resource with extension,
      if (req.url) {
        const cacheHeader = getCacheHeader(req.url)
        if (cacheHeader) {
          res.setHeader(`Cache-Control`, cacheHeader)
        }
      }
      return requestHandler(req, res)
    } else {
      // if no extension, this might be the ssr request.
      // check cookies for ssr request in order to use authentication
      return nextExpressWrapperHandler(req, res)
    }
  }

  return handler
}
