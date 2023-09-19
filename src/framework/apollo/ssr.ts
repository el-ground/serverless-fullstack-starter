import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr'

export const getSSRClient = () => {
  const client = globalThis.getSSRClient()
  // override types to pass instanceof check
  if (!(client instanceof NextSSRApolloClient)) {
    // eslint-disable-next-line no-proto
    client.__proto__ = NextSSRApolloClient.prototype
  }
  if (!(client.cache instanceof NextSSRInMemoryCache)) {
    // eslint-disable-next-line no-proto
    client.cache.__proto__ = NextSSRInMemoryCache.prototype
  }

  return client
}
