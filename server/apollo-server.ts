import { ApolloServer } from '@apollo/server'
import type { Server } from 'http'
import type { Application } from 'express'
import { json } from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import type { Context } from './context'
import { schema } from './schema'

// https://github.com/apollographql/apollo-server/issues/1933
export const bindApolloServer = async (
  app: Application,
  httpServer: Server,
) => {
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
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  )
}
