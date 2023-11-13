'use client'
import { toast, Id } from 'react-toastify'
import { Client, createClient } from 'graphql-ws'

// should only filled in browser env
let client: Client | null = null

let connectionToastId: Id | null = null
let retrying = false

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
          if (retrying) {
            console.log(`Websocket reconnected :)`)

            // prevent multiple connect - reconnect being stacked
            if (connectionToastId && toast.isActive(connectionToastId)) {
              toast.update(connectionToastId, {
                render: `서버와 재연결되었습니다.`,
                type: toast.TYPE.SUCCESS,
                autoClose: 500,
                isLoading: false,
              })
            } else {
              connectionToastId = toast.success(`서버와 재연결되었습니다.`, {
                autoClose: 500,
                position: toast.POSITION.BOTTOM_CENTER,
              })
            }
          }
          retrying = false
        },
      },
      // https://the-guild.dev/graphql/ws/docs/interfaces/client.ClientOptions#shouldretry
      shouldRetry: (errOrCloseEvent: unknown) => {
        console.error(`Websocket errOrCloseEvent:`)
        console.error(errOrCloseEvent)
        console.error(`Retrying connection...`)
        if (!retrying) {
          if (!connectionToastId) {
            connectionToastId = toast.error(
              `서버와의 연결을 재시도하고 있습니다.`,
              {
                position: toast.POSITION.BOTTOM_CENTER,
                closeButton: true,
                autoClose: false,
                isLoading: true,
              },
            )
          } else if (toast.isActive(connectionToastId)) {
            toast.update(connectionToastId, {
              render: `서버와의 연결을 재시도하고 있습니다.`,
              type: toast.TYPE.ERROR,
              position: toast.POSITION.BOTTOM_CENTER,
              closeButton: true,
              autoClose: false,
              isLoading: true,
            })
          }
          retrying = true
        }
        return true
      },
      retryAttempts: Infinity, // retryyyyyy
      retryWait: () => new Promise((resolve) => setTimeout(resolve, 3000)),
    })
  }

  return client
}
