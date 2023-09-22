'use client'
import React from 'react'
import { HttpLink, split, useSubscription } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import {
  ApolloNextAppProvider,
  useSuspenseQuery,
  useQuery,
  useBackgroundQuery,
  useFragment,
  useReadQuery,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  //  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '@/schema/__generated__/client'
import { useMutation, ErrorMessages } from './use-mutation'
import { getWebsocketGraphQLClient } from './websocket'
import { getSSRClient } from './ssr'

export const getClient = () => {
  if (typeof window === `undefined`) {
    // ssr
    return getSSRClient()
  } else {
    // browser

    const httpLink = new HttpLink({
      uri: `${window.location.origin}/api/graphql`,
    })
    const websocketGraphQLClient = getWebsocketGraphQLClient()
    const wsLink = new GraphQLWsLink(websocketGraphQLClient)
    // https://www.apollographql.com/docs/react/data/subscriptions/#3-split-communication-by-operation-recommended
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink,
    )

    return new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      link: splitLink,
    })
  }
}

export const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <ApolloNextAppProvider makeClient={getClient}>
      {children}
    </ApolloNextAppProvider>
  )
}

export {
  useSuspenseQuery,
  useQuery,
  useBackgroundQuery,
  useFragment,
  useReadQuery,
  useMutation,
  useSubscription,
  gql,
}
export type { ErrorMessages }

/*
  https://www.apollographql.com/blog/apollo-client/next-js/how-to-use-apollo-client-with-next-js-13/
  how to use in client
  "use client";

  import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
  import { gql } from "@apollo/client";

  const query = gql`query Now {
      now(id: "1")
  }`;

  export default function Page() {
    const { data } = useSuspenseQuery(query);

    return <main>{data.now}</main>;
  }
*/
