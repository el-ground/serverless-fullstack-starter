'use server'
import { getAuthDependencies } from './util'
import { validateAndParse } from '#framework/auth/validate-parse-and-refresh'

export const getAuthPayloadFromCookieStringServer = (authToken: string) => {
  return validateAndParse(authToken)
}

globalThis.getAuthPayloadFromCookieStringServer =
  getAuthPayloadFromCookieStringServer

export const getAuth = () => {
  const { authPayload } = getAuthDependencies()
  return authPayload
}
