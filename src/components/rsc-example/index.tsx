import React from 'react'
import Image from 'next/image'
import Like from '@/assets/sample.svg'
import { getClient, gql } from '@/src/framework/apollo/rsc'

const query = gql(`
query getBooks2 {
    books {
        author
    }
}`)

export const RSCExample = async () => {
  const client = getClient()
  const { data } = await client.query({ query })
  return (
    <div>
      <Image priority src={Like} alt="heart" width={24} height={24} />
      {data?.books?.map((e) => JSON.stringify(e))}
    </div>
  )
}
