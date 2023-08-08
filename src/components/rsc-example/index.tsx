import React from 'react'
import Like from '@/assets/sample.svg'
import { getClient, gql } from '@/src/framework/apollo/rsc'

const query = gql(`
  query GetBooks2 {
    Book_books {
        author
    }
}`)

export const RSCExample = async () => {
  const client = getClient()
  const { data } = await client.query({ query })
  return (
    <div>
      <Like width={24} height={24} />
      {data?.Book_books?.map((e) => JSON.stringify(e))}
    </div>
  )
}
