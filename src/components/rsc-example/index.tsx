import React from 'react'
import Like from '@/assets/sample.svg'
import { getSSRClient, gql } from '@/src/framework/apollo/rsc'
import { getAuth } from '@hooks/use-auth'

const query = gql(`
  query GetBooks2 {
    Book_books {
        author
    }
}`)

export const RSCExample = async () => {
  const client = getSSRClient()
  const { userId, isAuthenticated } = getAuth()

  const { data } = await client.query({ query })
  return (
    <div>
      <div>
        userId : {`${userId}`}, isAuthenticated : {`${isAuthenticated}`}
      </div>
      <Like width={24} height={24} />
      {data?.Book_books?.map((e) => JSON.stringify(e))}
    </div>
  )
}
