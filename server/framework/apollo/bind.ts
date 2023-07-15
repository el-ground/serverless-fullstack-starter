import { ApolloServer } from '@apollo/server'
import type { Server } from 'http'
import type { Application } from 'express'
import { json } from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createLoader } from '@/server/framework/database/loader'
import type { Context } from './context'
import { schema } from './schema'

// https://github.com/apollographql/apollo-server/issues/1933
export const bind = async (app: Application, httpServer: Server) => {
  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // Development only
    introspection: process.env.NODE_ENV === `development`,
  })
  // prepare apollo
  await server.start()
  // add apollo to express app
  app.use(
    '/api/graphql',
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        /*
          TODO : auth object populate
        */
        const userId = (req as any).auth?.userId
        const isAdmin = (req as any).auth?.isAdmin
        const isAuthorized = !!userId

        const loader = createLoader()

        return {
          loader,
          userId,
          isAdmin,
          isAuthorized,
        }
      },
    }),
  )
}
