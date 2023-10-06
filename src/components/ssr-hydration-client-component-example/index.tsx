'use client'
import React from 'react'

import { useSuspenseQuery } from '@/src/framework/apollo/client'
import { gql } from '@/schema/__generated__/client/gql'
import Like from '@/assets/sample.svg'
import { useAuth } from '@hooks/use-auth/client'
import { logOut, deleteAccount } from '@framework/auth'
import styles from './style.module.scss'

const query = gql(`
  query GetBooks {
      Book_books {
        author
        title
    }
  }
`)

export const SSRHydrationClientComponentExample = () => {
  const { userId, isAuthenticated } = useAuth()
  const { error, data } = useSuspenseQuery(query)

  if (error) return <p>Error : {error.message}</p>
  return (
    <>
      {isAuthenticated ? (
        <>
          <button type="button" className="link" onClick={logOut}>
            로그아웃
          </button>
          <button type="button" className="link" onClick={deleteAccount}>
            회원탈퇴
          </button>
        </>
      ) : null}
      <div>
        userId : {`${userId}`}, isAuthenticated : {`${isAuthenticated}`}
      </div>
      <Like width={24} height={24} />
      <div className={styles.rootContainer}>
        {data?.Book_books?.map((e) => JSON.stringify(e))}
      </div>
      <button type="button" className="t14">
        버튼 버튼입니당
      </button>
      <a type="button" href="#" className="t14 link">
        앵커 버튼입니당
      </a>
      <input type="submit" value="Input submit button" className="t14" />
      <p className="t14 fit">하이하이</p>
    </>
  )
}
