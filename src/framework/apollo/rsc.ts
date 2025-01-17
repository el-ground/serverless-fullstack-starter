'use server'
/*
  This module is called inside next server code, neither in our express handler or browser.
*/
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { gql } from '@/schema/__generated__/client'
import { ApolloLink } from '@apollo/client'
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { createContext } from '#framework/apollo/context'
import { setContext } from '@apollo/client/link/context'
import { validateAndParse } from '@/server/framework/auth/validate-parse-and-refresh'
import { cookies } from 'next/headers'

import { SchemaLink } from '@apollo/client/link/schema'
import { schema } from '@/server/framework/apollo/schema'

// https://www.apollographql.com/docs/react/api/link/apollo-link-schema/
const { getClient: getSSRClient } = registerApolloClient(() => {
  const client = new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    ssrMode: true,
    // https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link-schema/src/index.ts
    link: ApolloLink.from([
      new SSRMultipartLink({
        stripDefer: true,
      }),
      setContext(async () => {
        const cookieStore = cookies()

        const authorizationPayloadCookie =
          cookieStore.get(`authorization-payload`)?.value || ``
        const authorizationRestCookie =
          cookieStore.get(`authorization-rest`)?.value || ``
        const authToken = authorizationPayloadCookie + authorizationRestCookie
        // getAuthPayload from authToken

        const authPayload = validateAndParse(authToken)

        return createContext({
          auth: authPayload,
          setAuthToken: () => {
            throw new Error(`cannot set auth token in rsc`)
          },
        })
      }),
      new SchemaLink({
        schema,
        context: (operation) => {
          return operation.getContext()
        },
      }),
    ]),
  })

  return client
})

globalThis.getSSRClient = getSSRClient

/*
  Components that are completely rendered in server, no hydration, etc.
*/

export { getSSRClient, gql }

/*
  https://www.apollographql.com/blog/apollo-client/next-js/how-to-use-apollo-client-with-next-js-13/
  how to use in server component : 
  import { getSSRCient } from "@/src/framework/apollo/ssr-client";
  import { gql } from "@apollo/client";

  export const revalidate = 5;
  const query = gql`query Now {
      now(id: "1")
  }`;

  export default async function Page() {
    const client = getClient();
    const { data } = await client.query({ query });

    return <main>{data.now}</main>;
  }
*/
