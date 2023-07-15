import { ApolloServer } from '@apollo/server'
import type { Server } from 'http'
import { Router, json } from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createLoader } from '@/server/framework/database/loader'
import { validateParseAndRefreshAuthCookiesMiddleware } from '@/server/framework/auth/validate-parse-and-refresh/middleware'
import cookieParser from 'cookie-parser'
import type { Context } from './context'
import { schema } from './schema'

// https://github.com/apollographql/apollo-server/issues/1933
export const createRouter = async (httpServer: Server) => {
  const router = Router()

  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // Development only
    introspection: process.env.NODE_ENV === `development`,
  })
  // prepare apollo
  await server.start()
  // add apollo to express app
  router.use(json())
  router.use(cookieParser()) // required to parse auth
  // apollo can refresh token!
  router.use(validateParseAndRefreshAuthCookiesMiddleware({ refresh: true }))
  router.use(
    expressMiddleware(server, {
      context: async ({ req }) => {
        const loader = createLoader()

        return {
          loader,
          ...req.auth,
        }
      },
    }),
  )

  return router
}
