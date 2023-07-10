'use client'
import React from 'react'

import { useSuspenseQuery } from '#src/framework/apollo'

import { gql } from '@apollo/client'

import styles from './style.module.scss'

const GET_BOOKS = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`

export const Dummy = () => {
  const { error, data } = useSuspenseQuery<any>(GET_BOOKS)
  if (error) return <p>Error : {error.message}</p>
  return (
    <div className={styles.rootContainer}>
      {data.books.map((e: any) => JSON.stringify(e))}
    </div>
  )
}
