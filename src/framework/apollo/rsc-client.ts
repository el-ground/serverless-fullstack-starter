// lib/client.js

import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { makeClient } from './make-client'

export const { getClient } = registerApolloClient(() => {
  return makeClient()
})

/*
  https://www.apollographql.com/blog/apollo-client/next-js/how-to-use-apollo-client-with-next-js-13/
  how to use in server component : 
  import { getClient } from "#src/framework/apollo/ssr-client";
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
