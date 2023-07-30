import React from 'react'
import Like from '@/assets/sample.svg'
import { getClient, gql } from '@/src/framework/apollo/rsc'

const query = gql(`
query getBooks2 {
    book {
      books {
          author
      }
    }
}`)

export const RSCExample = async () => {
  const client = getClient()
  const { data } = await client.query({ query })
  return (
    <div>
      <Like width={24} height={24} />
      {data?.book.books?.map((e) => JSON.stringify(e))}
    </div>
  )
}
