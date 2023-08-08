'use client'
import React from 'react'
import { SuspenseCache, HttpLink, ApolloLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  useSuspenseQuery,
  useQuery,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { gql } from '@/schema/__generated__/client'
import { useMutation, ErrorMessages } from './use-mutation'
import { getOrigin } from '@/config'

/*
  SSR + hydration & client side render

  useSuspenseQuery : SSR initial render with data and hydrate later.
*/

export const makeClient = () => {
  // https://www.apollographql.com/docs/react/networking/advanced-http-networking/
  // https://github.com/apollographql/apollo-client-nextjs

  const httpLink = new HttpLink({ uri: `${getOrigin()}/api/graphql` })

  const links: ApolloLink[] = []
  if (typeof window === `undefined`) {
    links.push(
      new SSRMultipartLink({
        stripDefer: true,
      }),
    )
  }
  links.push(httpLink)

  const client = new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: ApolloLink.from(links),
  })

  return client
}

const makeSuspenseCache = () => {
  return new SuspenseCache()
}

export const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
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
