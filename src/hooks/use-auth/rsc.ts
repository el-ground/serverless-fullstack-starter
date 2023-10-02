'use server'
import { validateAndParse } from '#framework/auth/validate-parse-and-refresh'

export const getAuthPayloadFromCookieStringServer = (authToken: string) => {
  return validateAndParse(authToken)
}

globalThis.getAuthPayloadFromCookieStringServer =
  getAuthPayloadFromCookieStringServer
