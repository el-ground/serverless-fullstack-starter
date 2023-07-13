import React from 'react'
import { getClient, gql } from '@/src/framework/apollo/rsc'

const query = gql(`
query getBooks2 {
    books {
        author
    }
}`)

const RSCExample = async () => {
  const client = getClient()
  const { data } = await client.query({ query })
  return <div>{data?.books?.map((e) => JSON.stringify(e))}</div>
}

export default RSCExample
