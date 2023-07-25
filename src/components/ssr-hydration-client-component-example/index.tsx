'use client'
import React from 'react'

import { useSuspenseQuery } from '@/src/framework/apollo/client'

import { gql } from '@/schema/__generated__/client/gql'
import Like from '@/assets/sample.svg'
import styles from './style.module.scss'

const query = gql(`
  query GetBooks {
    books {
      author
      title
    }
  }
`)

/*
  Problem when yarn build : 
  Next.js static site depends on 
*/

export const SSRHydrationClientComponentExample = () => {
  const { error, data } = useSuspenseQuery(query)

  if (error) return <p>Error : {error.message}</p>
  return (
    <React.Suspense fallback="loading...">
      <Like width={24} height={24} />
      <div className={styles.rootContainer}>
        {data?.books?.map((e) => JSON.stringify(e))}
      </div>
    </React.Suspense>
  )
}
