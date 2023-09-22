import type { Server } from 'http'
import { WebSocketServer } from 'ws'
import { schema } from './schema'
import { useServer as useWebsocketServer } from 'graphql-ws/lib/use/ws'
import { Context, SubscribeMessage } from 'graphql-ws'

export const createWebsocketServer = (httpServer: Server) => {
  // https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api/graphql',
    // dependency of ws, the node websocket library
  })

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const websocketServerCleanup = useWebsocketServer(
    // dependency of graphql-ws
    {
      schema,
      // https://the-guild.dev/graphql/ws/docs/modules/use_ws
      // https://the-guild.dev/graphql/ws/docs/interfaces/server.ServerOptions
      // https://github.com/enisdenjo/graphql-ws/blob/master/src/server.ts
      // https://www.apollographql.com/docs/apollo-server/data/subscriptions#onconnect-and-ondisconnect
      /*
          onConnect,
          onDisconnect,
          onClose,
          onSubscribe,
          onOperation,
          onNext,
          onError,
          onComplete,
      */
      onConnect: (ctx) => {
        // TODO : attach a connection id

        const request = ctx.extra.request
        const cookie = request.headers.cookie // go cookie parser!
        // TODO : setup authentication context here!
        console.log(`onConnect : ${cookie}`)
      },
      onDisconnect: (ctx: Context, code, reason) => {
        console.log(`onDisconnect : ${code} : ${reason}`)
      },
      onClose: (ctx: Context, code, reason) => {
        // if connection id had exists, cleanup subscriptions
        console.log(`onClose : ${code} : ${reason}`)
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSubscribe: (ctx: Context, message: SubscribeMessage) => {
        // TODO : register to backend subscribe
        console.log(`onSubscribe`)
      },
      onError: () => {
        // TODO : log errors
        console.log(`onError`)
      },
      onNext: () => {
        // TODO : log server -> client data send
        console.log(`onNext`)
      },

      // TODO : log
      onOperation: () => {
        console.log(`onOperation`)
      },

      onComplete: () => {
        console.log(`onComplete`)
      },
    },
    wsServer,
  )

  const apolloServerPluginDrainWebsocketServer = {
    async serverWillStart() {
      return {
        async drainServer() {
          await websocketServerCleanup.dispose()
        },
      }
    },
  }

  return apolloServerPluginDrainWebsocketServer
}
