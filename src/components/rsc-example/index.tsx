import React from 'react'
import Like from '@/assets/sample.svg'
import { getClient, gql } from '@/src/framework/apollo/rsc'
import { getAuthRSC } from '@hooks/use-auth/rsc'

const query = gql(`
  query GetBooks2 {
    Book_books {
        author
    }
}`)

export const RSCExample = async () => {
  const client = getClient()
  const { userId, isAuthenticated } = getAuthRSC()

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
