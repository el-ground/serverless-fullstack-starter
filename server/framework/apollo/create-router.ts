import { ApolloServer } from '@apollo/server'
import type { Server } from 'http'
import { Router, json } from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createLoader } from '@/server/framework/database/loader'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import cookieParser from 'cookie-parser'
import { createWebsocketServer } from './websocket'
import type { Context } from './context'
import { schema } from './schema'
import { logIdentifiers } from '#framework/express/middlewares/request-logger'
import { logError } from '#util/log'
import { LogPlugin } from './logger'

import { sessionIdCookieMiddleware } from '../session'

// https://github.com/apollographql/apollo-server/issues/1933
export const createRouter = async (httpServer: Server) => {
  const router = Router()

  const apolloServerPluginDrainWebsocketServer =
    createWebsocketServer(httpServer)

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      apolloServerPluginDrainWebsocketServer,
      LogPlugin,
    ],
    includeStacktraceInErrorResponses: true,
    // Development only
    introspection: process.env.NODE_ENV === `development`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatError: (formattedError, error: any) => {
      // 1. formattedError.stacktrace?.join(`\n`) || `` // log
      // 2. formattedError.toString() // gql log
      // 3. formattedError.

      const {
        code = `INTERNAL_SERVER_ERROR`,
        stacktrace,
        ...rest
      } = formattedError?.extensions || {}
      const stringifiedError = error?.toString() || ``
      let stringifiedStacktrace = ``
      try {
        stringifiedStacktrace = (stacktrace as string[]).join(`\n`)
      } catch (e) {
        /* no-op */
      }
      const stringifiedRestExtensions = JSON.stringify(rest, null, 2)
      const fullErrorMessage = `START OF ERROR
------------------------- Code ---------------------------------------

${code}

------------------------- Error.toString() ---------------------------

${stringifiedError}

------------------------- Stack --------------------------------------

${stringifiedStacktrace}

------------------------- JSON.stringify(Extensions, null, 2) --------

${stringifiedRestExtensions}

------------------------- END OF ERROR -------------------------------`

      logError(fullErrorMessage)

      if (code !== `INTERNAL_SERVER_ERROR`) {
        // if code provided, the error was intended for client to handle.
        delete formattedError?.extensions?.stacktrace // remove stacktrace
        return formattedError
      }

      return {
        message: `Internal server error`,
        extensions: {
          code,
        },
      }
    },
  })

  // prepare apollo
  await server.start()
  // add apollo to express app
  router.use(json())
  router.use(cookieParser()) // required to parse auth
  router.use(sessionIdCookieMiddleware())
  // apollo can refresh token!
  router.use(validateParseAndRefreshAuthCookiesMiddleware({ refresh: true }))
  router.use(logIdentifiers())
  router.use(
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const loader = createLoader()
        const setAuthToken = res.setAuthToken

        return {
          loader,
          setAuthToken,
          ...req.auth,
        }
      },
    }),
  )

  return router
}
