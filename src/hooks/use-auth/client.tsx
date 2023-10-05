'use client'
import React from 'react'
import { getWebsocketGraphQLClient } from '@framework/apollo/websocket'
import equal from 'deep-equal'
import { getAuthDependencies } from './util'
import { useBoxedCallback } from '../use-boxed-callback'
import { useRouter } from 'next/router'
import type { AuthPayload } from '@/server/framework/auth'

const UpdateAuthHandleContext = React.createContext<
  (to?: string, replace?: boolean) => void
>(() => {})
const AuthPayloadContext = React.createContext<AuthPayload>(
  getAuthDependencies().authPayload,
)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /*
    1. stores local auth state which to be notified 
  */

  const router = useRouter()
  const [authDependencies, setAuthDependencies] = React.useState(
    getAuthDependencies(),
  )

  const updateAuth = useBoxedCallback(
    (to?: string, replace?: boolean) => {
      const newAuthDependencies = getAuthDependencies()

      const {
        sidCookie: prevSidCookie,
        authorizationPayloadCookie: prevAuthorizationPayloadCookie,
        authPayload: prevAuthPayload,
      } = authDependencies

      const { userId: prevUserId } = prevAuthPayload

      const { sidCookie, authorizationPayloadCookie, authPayload } =
        newAuthDependencies

      const { userId } = authPayload

      const hasAuthPayloadChanged = !equal(authPayload, prevAuthPayload)
      const hasSessionChanged =
        prevSidCookie !== sidCookie ||
        prevAuthorizationPayloadCookie !== authorizationPayloadCookie

      if (hasSessionChanged) {
        // terminate websocket session
        console.log(`session changed. terminating graphql client.`)
        getWebsocketGraphQLClient().terminate()
      }

      const hasLoggedIn = !prevUserId && userId
      const hasUserChanged = prevUserId && userId && userId !== prevUserId
      const hasLoggedOut = prevUserId && !userId

      /*
      1. logout : reload with clear localStorage
      2. user change : reload with clear localStorage
      3. login : just update payload
      4. payload change : just update payload
    */

      if (hasLoggedOut || hasUserChanged) {
        console.log(`auth payload changed. reloading page `)
        window.localStorage.clear()
        if (to) {
          window.location.pathname = to
        } else {
          window.location.reload()
        }
      } else if (hasLoggedIn || hasAuthPayloadChanged) {
        setAuthDependencies(authDependencies)
        if (to) {
          if (replace) {
            router.replace(to)
          } else {
            router.push(to)
          }
        }
      }
    },
    [authDependencies, router],
  )

  React.useEffect(() => {
    const handle = window.setInterval(updateAuth, 5000)
    return () => {
      window.clearInterval(handle)
    }
  }, [updateAuth])

  return (
    <UpdateAuthHandleContext.Provider value={updateAuth}>
      <AuthPayloadContext.Provider value={authDependencies.authPayload}>
        {children}
      </AuthPayloadContext.Provider>
    </UpdateAuthHandleContext.Provider>
  )
}

export const useUpdateAuth = () => {
  const updateAuth = React.useContext(UpdateAuthHandleContext)
  return updateAuth
}

export const useAuth = () => {
  const authPayload = React.useContext(AuthPayloadContext)
  return authPayload
}

// used for getting auth outside react hooks
export const getAuth = () => {
  const { authPayload } = getAuthDependencies()
  return authPayload
}
