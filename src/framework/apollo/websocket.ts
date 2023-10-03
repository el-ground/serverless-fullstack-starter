'use client'
import { toast, Id } from 'react-toastify'
import { Client, createClient } from 'graphql-ws'

// should only filled in browser env
let client: Client | null = null

let connectionToastId: Id | null = null
let toastManuallyClosed = false

export const getWebsocketGraphQLClient = () => {
  if (typeof window === `undefined`) {
    throw new Error(`should not be called outside browser`)
  }

  if (!client) {
    client = createClient({
      url: `${window.location.protocol === `http:` ? `ws://` : `wss://`}${
        window.location.host
      }/api/graphql`,
      on: {
        connected: () => {
          if (connectionToastId) {
            console.log(`Websocket reconnected :)`)
            if (toastManuallyClosed) {
              toast.success(`서버와 재연결되었습니다.`, {
                autoClose: 2000,
                position: toast.POSITION.BOTTOM_CENTER,
              })
            } else {
              toast.update(connectionToastId, {
                render: `서버와 재연결되었습니다.`,
                type: toast.TYPE.SUCCESS,
                autoClose: 2000,
                isLoading: false,
              })
            }
          }
          connectionToastId = null
          toastManuallyClosed = false
        },
      },
      // https://the-guild.dev/graphql/ws/docs/interfaces/client.ClientOptions#shouldretry
      shouldRetry: (errOrCloseEvent: unknown) => {
        console.error(`Websocket errOrCloseEvent:`)
        console.error(errOrCloseEvent)
        console.error(`Retrying connection...`)
        if (!connectionToastId) {
          toastManuallyClosed = false
          connectionToastId = toast.error(
            `서버와의 연결을 재시도하고 있습니다.`,
            {
              position: toast.POSITION.BOTTOM_CENTER,
              closeButton: true,
              autoClose: false,
              isLoading: true,
            },
          )
          const unsubscribe = toast.onChange(({ id, status }) => {
            if (id === connectionToastId && status === `removed`) {
              toastManuallyClosed = true
              unsubscribe()
            }
          })
        }
        return true
      },
      retryAttempts: Infinity, // retryyyyyy
      retryWait: () => new Promise((resolve) => setTimeout(resolve, 3000)),
    })
  }

  return client
}
