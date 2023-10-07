import { ApolloServer } from '@apollo/server'
import type { Server } from 'http'
import { Router, Request, Response, json } from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import cookieParser from 'cookie-parser'
import { createWebsocketServer } from './websocket'
import type { Context } from './context'
import { createContext } from './context'
import { schema } from './schema'
import { logIdentifiers } from '#framework/express/middlewares/request-logger'
import { logError } from '#util/log'
import { stringifyError } from './stringify-error'
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

      const extensions = formattedError?.extensions || {}
      const stringifiedError = stringifyError(extensions, error)
      logError(stringifiedError)

      const { code = `INTERNAL_SERVER_ERROR` } = extensions

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
  router.use(validateParseAndRefreshAuthCookiesMiddleware())
  router.use(logIdentifiers())
  router.use(
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return createContext({
          setAuthToken: (res as Response).setAuthToken,
          auth: (req as Request).auth,
        })
      },
    }),
  )

  return router
}
