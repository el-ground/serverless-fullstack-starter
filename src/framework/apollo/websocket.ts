'use client'
import { Client, createClient } from 'graphql-ws'

// should only filled in browser env
let client: Client | null = null

export const getWebsocketGraphQLClient = () => {
  if (typeof window === `undefined`) {
    throw new Error(`should not be called in browser`)
  }

  if (!client) {
    client = createClient({
      url: `${window.location.protocol === `http:` ? `ws://` : `wss://`}${
        window.location.host
      }/api/graphql`,
    })
  }

  return client
}
