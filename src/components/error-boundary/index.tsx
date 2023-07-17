'use client'
import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import styles from './style.module.scss'

// Module scope errors
let errorMessages: string[] = []

/*
  1. if error.code
  2. if error.stack
    else if error.message
  3. JSON.stringify(error, null, 2)
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (error: any, info: { componentStack: string }) => {
  let errorMessage = ``
  try {
    const code = error?.code
    const stack = error?.stack
    const message = error?.message
    const componentStack = info?.componentStack
    if (code) {
      errorMessage += `\n\n에러 코드--------------\n\n${code}`
    }
    if (stack) {
      errorMessage += `\n\n에러 코드 위치--------------\n\n${stack}`
    } else if (message) {
      errorMessage += `\n\n에러 문자--------------\n\n${message}`
    } else {
      errorMessage += `\n\n에러 객체--------------\n\n${JSON.stringify(
        error,
        null,
        2,
      )}`
    }

    if (componentStack) {
      errorMessage += `\n\n에러 요소 위치--------------\n\n${componentStack}`
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    errorMessage += `\n\n에러 실패 코드 위치--------------\n\n${e?.stack}`
  }

  errorMessages = [...errorMessages, errorMessage]
  console.error(errorMessage)
}

const ErrorFallback = () => {
  /*
    error

    에러 메세지 보기 <길 수 있어요!>
  */

  const [currentErrorMessages, setCurrentErrorMessages] = React.useState<
    string[]
  >(() => errorMessages)

  let errorPath = ``
  if (typeof window !== `undefined`) {
    // not using url's getCurrentPath because we don't want dependency
    // error boundary should have minimal dependency in order to reduce risk
    errorPath = window?.location?.href.replace(window?.location?.origin, ``)
  }

  return (
    <div className={styles.rootContainer}>
      <h1>에러가 발생했어요!</h1>
      <a
        className={styles.errorAction}
        onClick={(e) => {
          e?.preventDefault()
          window?.location.reload()
        }}
        href=""
      >
        마지막 화면으로 돌아가기
      </a>
      <a className={styles.errorAction} href="/">
        메인 화면으로 이동하기
      </a>
      <p className={styles.errorPath}>
        에러가 발생한 페이지 :
        <br />
        {errorPath}
      </p>
      <ul className={styles.errorList}>
        <button
          type="button"
          className="render-error-button"
          onClick={() => setCurrentErrorMessages(errorMessages)}
        >
          에러 메세지 열기
        </button>
        {currentErrorMessages.map((errorMessage, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className={styles.errorListBlock} key={index}>
            {errorMessage
              .split(`\n`)
              // eslint-disable-next-line react/no-array-index-key
              .map((e, index) => [e, <br key={index} />])}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={errorHandler}
    >
      {children}
    </ReactErrorBoundary>
  )
}
