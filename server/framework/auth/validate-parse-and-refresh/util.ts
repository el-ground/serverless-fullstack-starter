import type { CookieOptions } from 'express'
import { refreshTokenDurationSeconds } from '../config'

const isHTTPS = process.env.SECURE === `true`
const secure = process.env.NODE_ENV === `development` ? isHTTPS : true

export const splitJWT = (token: string) => {
  /*
    content in javascript part,
    checksum in http part.
    so that javascript client can parse the cookie and use the payloads.

    https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  */

  const sliceAtIndex = token.indexOf(`.`, token.indexOf(`.`) + 1)
  const payload = token.slice(0, sliceAtIndex) // contains the payload
  const rest = token.slice(sliceAtIndex) // contains checksum & etc

  return {
    payload,
    rest,
  }
}

export const getSetAuthToken = (
  setCookie: (key: string, value: string, options: CookieOptions) => void,
  clearCookie: (key: string) => void,
) => {
  return (token: string | null) => {
    if (token) {
      const { payload, rest } = splitJWT(token)

      // payload data might need to be read in the webapp.
      setCookie('authorization-payload', payload, {
        secure,
        sameSite: `strict`,
        maxAge: refreshTokenDurationSeconds,
      })

      setCookie(`authorization-rest`, rest, {
        secure,
        sameSite: `strict`,
        httpOnly: true, // set to http to prevent forgery
        maxAge: refreshTokenDurationSeconds,
      })
    } else {
      // if called with empty token, cookie delete
      clearCookie('authorization-payload')
      clearCookie('authorization-rest')
    }
  }
}
