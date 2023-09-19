'use client'
import React from 'react'
import { HttpLink, ApolloLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  useSuspenseQuery,
  useQuery,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  //  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '@/schema/__generated__/client'
import { useMutation, ErrorMessages } from './use-mutation'
import { getOrigin } from '@/config'
import { getSSRClient } from './ssr'

export const getClient = () => {
  if (typeof window === `undefined`) {
    // ssr
    return getSSRClient()
  } else {
    // browser
    return new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      link: ApolloLink.from([
        new HttpLink({ uri: `${getOrigin()}/api/graphql` }),
      ]),
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

export { useSuspenseQuery, useQuery, useMutation, gql }
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
