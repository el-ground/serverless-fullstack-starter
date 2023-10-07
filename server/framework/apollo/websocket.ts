import type { Server } from 'http'
import { WebSocketServer } from 'ws'
import { schema } from './schema'
import { useServer as useWebsocketServer, Extra } from 'graphql-ws/lib/use/ws'
import { validateAndParse } from '#framework/auth/validate-parse-and-refresh'
import { parse as parseCookie } from 'cookie'
import { createContext } from './context'
import { AuthPayload } from '../auth'
import { create as createUUID } from '#util/uuid'
import dayjs from 'dayjs'
import { logInfo, logError } from '#util/log'
import { getRequestIpAddress } from '#util/ip'
import { runWithRequestId } from '../express/middlewares/request-id'
import { stringifyError } from './stringify-error'
import { stringifyQuery } from './stringify-query'
import '#framework/pubsub/backend' // register backend

type WebsocketConnectionParams = Record<string, unknown>

type WebsocketExtraContext = {
  connectionId: string
  sessionId: string
  ip: string
  auth: AuthPayload
  connectedAtMs: number
}

const contextLogError = (
  extraContext: Partial<WebsocketExtraContext> & Extra,
  message: string,
  subid?: string,
) => {
  runWithRequestId(
    `conid:[${extraContext.connectionId || ``}]${
      subid ? ` subid:[${subid}]` : ``
    }`,
    () => logError(message),
  )
}

const contextLogInfo = (
  extraContext: Partial<WebsocketExtraContext> & Extra,
  message: string,
  subid?: string,
) => {
  runWithRequestId(
    `conid:[${extraContext.connectionId || ``}]${
      subid ? ` subid:[${subid}]` : ``
    }`,
    () => logInfo(message),
  )
}

/*
  logs inside subscription resolvers 
*/
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
  const websocketServerCleanup = useWebsocketServer<
    WebsocketConnectionParams,
    WebsocketExtraContext
  >(
    // dependency of graphql-ws
    {
      schema,
      // https://the-guild.dev/graphql/ws/docs/modules/use_ws
      // https://the-guild.dev/graphql/ws/docs/interfaces/server.ServerOptions
      // https://github.com/enisdenjo/graphql-ws/blob/master/src/server.ts
      // https://www.apollographql.com/docs/apollo-server/data/subscriptions#onconnect-and-ondisconnect
      context: async (ctx, message) => {
        /*
          context is created on each subscriptions;
          the auth is taken from the connection-establishing http request.
          dont use the dataloader from when resolving from the publish calls; 
          create new dataloader (caching) instances from each resolvers.
          only use the dataloader from the subscription call.
        */

        if (!ctx.extra.auth) {
          throw new Error(
            `ctx.extra.auth undefined. It must have been initialized in onConnect, but we cant find it in create context`,
          )
        }

        return createContext({
          auth: ctx.extra.auth,
          setAuthToken: () => {
            throw new Error(`cannot set auth token in websocket resolvers`)
          },
          subscriptionId: message.id,
          connectionId: ctx.extra.connectionId,
        })
      },
      /* eslint-disable @typescript-eslint/no-unused-vars */
      onConnect: (ctx) => {
        /*
          on socket establish;

          might add userId, requestId to the context and handle through subscribe etc logs.
          however we cannot use the cls storage
        */
        ctx.extra.connectedAtMs = Date.now()

        const request = ctx.extra.request
        const headers = request.headers
        const cookies = parseCookie(headers.cookie || ``)

        // 1. connectionId (like requestId)
        ctx.extra.connectionId = createUUID(20)

        // 2. auth
        const authorizationPayloadCookie = cookies[`authorization-payload`]
        const authorizationRestCookie = cookies[`authorization-rest`]
        const authToken = authorizationPayloadCookie + authorizationRestCookie

        // not refreshing auth token. websocket has no way to set cookie; just proceed with unauthorized.
        const authPayload = validateAndParse(authToken)
        ctx.extra.auth = authPayload

        // 3. sid
        const sessionId = cookies.sid
        ctx.extra.sessionId = sessionId || ``

        // 4. ip
        const ip = getRequestIpAddress(request)
        ctx.extra.ip = ip || ``

        contextLogInfo(
          ctx.extra,
          `step:[WS:CONNECT] ip:[${ip}] date:[${dayjs().format()}] method:[${
            request.method
          }] url:[${request.url}] referrer:[${
            headers.referer || ``
          }] user-agent:[${headers['user-agent']}]`,
        )

        contextLogInfo(
          ctx.extra,
          `step:[WS:IDENTIFY] sid:[${sessionId || ``}] uid:[${
            authPayload.userId || `ANONYMOUS`
          }] ip:[${ip}]`,
        )
      },
      onDisconnect: (ctx, code, reason) => {
        /*
          on connections that were correctly established & all subscriptions correctly resolved;
      */

        contextLogInfo(
          ctx.extra,
          `step:[WS:DISCONNECT] code:[${code}] reason:[${reason}]`,
        )
      },
      onClose: (ctx, code, reason) => {
        /*
          on all disconnect scenarios.
        */
        const { sessionId = ``, ip, connectedAtMs, auth } = ctx.extra

        const durationMs = connectedAtMs ? Date.now() - connectedAtMs : -1
        const uid = auth?.userId || `ANONYMOUS`

        contextLogInfo(
          ctx.extra,
          `step:[WS:CLOSE] sid:[${sessionId}}] uid:[${uid}] ip:[${ip}] date:[${dayjs().format()}] duration:[${durationMs}] code:[${code}] reason:[${reason}]`,
        )
      },
      onSubscribe: (ctx, message) => {
        /*
          on each subscribe start.
          message.payload.query & variables
        */

        const stringifiedQuery = stringifyQuery(
          message.payload.query,
          message.payload.variables,
        )

        contextLogInfo(
          ctx.extra,
          `step:[WS:SUBSCRIBE]\n\n${stringifiedQuery}`,
          message.id,
        )
      },
      onOperation: (ctx, message, args, result) => {
        /*
        on subscribe resolved and start listening.
        */
        // contextLogInfo(ctx.extra, `step:[WS:OPERATION]`, message.id)
      },
      onNext: (ctx, message, args, result) => {
        /*
          when resolve success;
          when published and client will receive the data
        */
        // contextLogInfo(ctx.extra, `step:[WS:NEXT]`, message.id)
      },
      onError: (ctx, message, errors) => {
        /*
          on error calls inside resolvers.
        */

        let errorString = ``

        errors.forEach((error) => {
          const extensions = error.extensions || {}
          const stringifiedError = stringifyError(
            extensions,
            error.originalError,
          )
          errorString += `\n\n${stringifiedError}`

          // print the stringifiedError here
        })

        contextLogError(ctx.extra, `step:[WS:ERROR]${errorString}`, message.id)
      },
      onComplete: (ctx, message) => {
        /*
          subscription done
        */

        contextLogInfo(ctx.extra, `step:[WS:COMPLETE]`, message.id)
      },

      /* eslint-enable @typescript-eslint/no-unused-vars */
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
