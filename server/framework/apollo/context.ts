import { createLoader, Loader } from '@/server/framework/database/loader'
import type { AuthPayload } from '@/server/framework/auth/auth-payload'
import { create as createUUID } from '#util/uuid'

/*
    Apollo graphQL Context

    There are two places that defines context :
    1. Graphql endpoint
    2. RSC schemaLink

    loader and authPayload set in both environments;
    refreshTokenId and setAuthToken is set only in 1. Graphql endpoint,
    not accessible in RSC.
*/
export interface Context extends AuthPayload {
  getLoader: () => Loader
  resetLoader: () => void // used for websocket resolvers
  setAuthToken: (token: string | null) => void
  contextId: string
  connectionId?: string
  requestId?: string
  subscriptionId?: string
}

export const createContext = ({
  setAuthToken,
  auth,
  // ids are optional
  connectionId, // websocket connection id
  requestId, // http request id
  subscriptionId, // websocket subscription id
}: {
  setAuthToken: (token: string | null) => void
  auth: AuthPayload
  connectionId?: string
  requestId?: string
  subscriptionId?: string
}): Context => {
  const contextId = createUUID(20)

  let loader: null | Loader = null
  const getLoader = () => {
    if (loader === null) {
      loader = createLoader()
    }
    return loader
  }

  const resetLoader = () => {
    if (loader) {
      loader = createLoader()
    }
  }

  return {
    getLoader,
    resetLoader,
    setAuthToken,
    ...auth,
    contextId,
    connectionId,
    requestId,
    subscriptionId,
  }
}
