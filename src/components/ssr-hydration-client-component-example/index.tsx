'use client'
import React from 'react'

import { useSuspenseQuery } from '@/src/framework/apollo/client'

import { gql } from '@/schema/__generated__/client/gql'
import Like from '@/assets/sample.svg'
import styles from './style.module.scss'

const query = gql(`
  query GetBooks {
    book {
      books {
        author
        title
      }
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
        {data?.book.books?.map((e) => JSON.stringify(e))}
      </div>
      <input type="text" value="foo" />
      <button type="button" className="t14">
        버튼 버튼입니당
      </button>
      <a type="button" href="#" className="t14 link">
        앵커 버튼입니당
      </a>
      <input type="submit" value="Input submit button" className="t14" />
      <p className="t14 fit">하이하이</p>
    </React.Suspense>
  )
}
