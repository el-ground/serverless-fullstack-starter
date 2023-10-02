'use client'
import { getWebsocketGraphQLClient } from '@framework/apollo/websocket'
import equal from 'deep-equal'
import { getAuthDependencies } from './util'

/*
  why not just use provider?
*/

// need use-client
// need to fulfill inside auth... useState etc.
let {
  sidCookie: prevSidCookie,
  authorizationPayloadCookie: prevAuthorizationPayloadCookie,
  authPayload: prevAuthPayload,
} = getAuthDependencies()

/*
    reads cookie and performs required actions to keep auth up to app state.
    to : 
*/
export const updateAuth = (to?: string) => {
  if (typeof window === `undefined`) {
    return
  }

  const { sidCookie, authorizationPayloadCookie, authPayload } =
    getAuthDependencies()
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
    console.log(`auth payload changed. reloading page `)
    window.localStorage.clear()
    if (to) {
      window.location.pathname = to
    } else {
      window.location.reload()
    }
    return
  }

  prevSidCookie = sidCookie
  prevAuthorizationPayloadCookie = authorizationPayloadCookie
  prevAuthPayload = authPayload
}

// register auth listner
if (typeof window !== `undefined`) {
  window.setInterval(updateAuth, 5000)
}
