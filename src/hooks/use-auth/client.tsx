'use client'
import React from 'react'
import { getWebsocketGraphQLClient } from '@framework/apollo/websocket'
import equal from 'deep-equal'
import { getAuthDependencies } from './util'
import { useBoxedCallback } from '../use-boxed-callback'
import { useRouter } from '@hooks/use-router'
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

      const { sidCookie, authorizationPayloadCookie, authPayload } =
        newAuthDependencies

      const hasAuthPayloadChanged = !equal(authPayload, prevAuthPayload)
      const hasSessionChanged =
        prevSidCookie !== sidCookie ||
        prevAuthorizationPayloadCookie !== authorizationPayloadCookie

      if (hasSessionChanged) {
        // terminate websocket session
        console.log(`session changed. terminating graphql client.`)
        getWebsocketGraphQLClient().terminate()
      }

      if (hasAuthPayloadChanged) {
        setAuthDependencies(newAuthDependencies)
        console.log(`auth payload changed. reloading page `)
        window.localStorage.clear()
        if (to) {
          window.location.pathname = to
        } else {
          window.location.reload()
        }
      } else if (to) {
        // userId stays the same;
        // if manually called, just navigate!
        if (replace) {
          router.replace(to)
        } else {
          router.push(to)
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
