import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { gql } from '@/schema/__generated__/client'

import { ApolloLink, InMemoryCache } from '@apollo/client'
import { NextSSRApolloClient } from '@apollo/experimental-nextjs-app-support/ssr'
import { SchemaLink } from '@apollo/client/link/schema'
import { schema } from '@/server/schema'
import { headers } from 'next/headers'

// https://www.apollographql.com/docs/react/api/link/apollo-link-schema/
const { getClient } = registerApolloClient(() => {
  // called every render.
  // https://www.apollographql.com/docs/react/networking/advanced-http-networking/

  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers

    const authorizationHeaderValue = headers().get('authorization')

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: authorizationHeaderValue,
      },
    }))

    return forward(operation)
  })

  const client = new NextSSRApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authMiddleware, new SchemaLink({ schema })]),
  })

  return client
})

/*
  Components that are completely rendered in server, no hydration, etc.
*/

export { getClient, gql }

/*
  https://www.apollographql.com/blog/apollo-client/next-js/how-to-use-apollo-client-with-next-js-13/
  how to use in server component : 
  import { getClient } from "@/src/framework/apollo/ssr-client";
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
