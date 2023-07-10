import { HttpLink, ApolloLink } from '@apollo/client'
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'

export const makeClient = () => {
  // https://www.apollographql.com/docs/react/networking/advanced-http-networking/

  // https://github.com/apollographql/apollo-client-nextjs
  const httpLink = new HttpLink({ uri: 'http://localhost:3000/api/graphql' })

  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers

    let authorizationHeaderValue: string | null = null
    if (typeof window !== `undefined`) {
      authorizationHeaderValue = localStorage.getItem(`token`)
    }

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: authorizationHeaderValue,
      },
    }))

    return forward(operation)
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authMiddleware,
            httpLink,
          ])
        : ApolloLink.from([authMiddleware, httpLink]),
  })
}
