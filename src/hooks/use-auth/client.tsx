'use client'
import React from 'react'
import Cookies from 'js-cookie'
import equal from 'deep-equal'
import { AuthPayload } from '#framework/auth'
import { useGetter } from '@hooks/use-getter'
import { useIsSSR } from '@hooks/use-is-ssr'
import { clearAuthSession } from '@model/auth'
import { getAuthPayloadFromCookieString } from './util'

const readAuthPayload = () => {
  const payload = Cookies.get(`authorization-payload`)
  return getAuthPayloadFromCookieString(payload)
}

const defaultPayload: AuthPayload = {
  isAuthenticated: false,
}

const AuthPayloadContext = React.createContext<AuthPayload>(defaultPayload)
const RefreshAuthPayloadContext = React.createContext<() => void>(() => {
  /* no-op */
})
/*
  Initial render (hydration) uses empty auth payload.
*/
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isSSR = useIsSSR()
  const [authPayload, setAuthPayload] =
    React.useState<AuthPayload>(defaultPayload)

  const getAuthPayload = useGetter(authPayload)
  const update = React.useCallback(() => {
    const prevAuthPayload = getAuthPayload()
    const newAuthPayload = readAuthPayload()

    const hasChanged = !equal(newAuthPayload, prevAuthPayload)

    /*
      TODO : if change, clear session?
    */
    if (hasChanged) {
      setAuthPayload(newAuthPayload)
    }

    /*  
      1. if logged out OR
      2. if session changed

      -> clear localStroage
    */

    if (prevAuthPayload.isAuthenticated && !newAuthPayload.isAuthenticated) {
      if (!newAuthPayload.isAuthenticated || hasChanged) {
        window.localStorage.clear()
        window.location.reload()
      }
    }
  }, [getAuthPayload])

  React.useEffect(() => {
    if (isSSR) {
      // update after hydrate
      update()
    }
  }, [isSSR, update])

  /*
    poll cookie parse. 5 seconds
  */
  React.useEffect(() => {
    const handle = window.setInterval(() => {
      update()
    }, 5000)

    return () => {
      window.clearInterval(handle)
    }
  }, [update])

  return (
    <AuthPayloadContext.Provider value={authPayload}>
      <RefreshAuthPayloadContext.Provider value={update}>
        {children}
      </RefreshAuthPayloadContext.Provider>
    </AuthPayloadContext.Provider>
  )
}

export const useAuth = () => {
  return React.useContext(AuthPayloadContext)
}

/*
  refreshAuth after potential cookie change!
  signin / signup / password-reset / logout / delete-account
*/
export const useRefreshAuth = () => {
  return React.useContext(RefreshAuthPayloadContext)
}
