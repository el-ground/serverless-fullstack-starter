import type { Request } from 'express'
import { logInfo } from '#util/log'
// find the key in cookie, replace the value.
export const getReplacedCookieHeaderString = (
  cookieHeader: string,
  key: string,
  value: string | null,
) => {
  if (cookieHeader.length === 0 && value) {
    // if header was empty, return;
    return `${key}=${value}`
  }

  const startIndex = cookieHeader.indexOf(`${key}=`)
  if (startIndex === -1) {
    if (!value) {
      return cookieHeader // if not found and no value set, just go on.
    }
    // the header was not found. append to it.
    return cookieHeader + `; ${key}=${value}`
  }

  // if index exists,
  const endIndex = cookieHeader.indexOf(`;`, startIndex)
  if (endIndex === -1) {
    // I'm the last cookie!

    if (!value) {
      // if no value, return header in front of me;
      // remove trailing semicolon
      return cookieHeader.substring(0, startIndex).replace(/; ?$/, ``)
    }

    // if value exist, append me at the end.
    return cookieHeader.substring(0, startIndex) + `${key}=${value}`
  }

  // replace ${key}=${prevValue} with ${key}=${value}
  if (!value) {
    return (
      // remove trailing semicolon of segment in front of me
      cookieHeader.substring(0, startIndex).replace(/; ?$/, ``) +
      cookieHeader.substring(endIndex)
    )
  } else {
    return (
      cookieHeader.substring(0, startIndex) +
      `${key}=${value}` +
      cookieHeader.substring(endIndex)
    )
  }
}

// replace cookie string and req.cookies object
export const replaceCookiesInRequest = (
  req: Request,
  key: string,
  value: string | null,
) => {
  const prevCookieHeader = req.headers.cookie || ``
  const replacedCookieString = getReplacedCookieHeaderString(
    prevCookieHeader,
    key,
    value,
  )

  logInfo(
    `Replace Cookies!\nprev : ${prevCookieHeader}\nkey : ${key}\nvalue : ${value}\nreplaced : ${replacedCookieString}`,
  )
  req.headers.cookie = replacedCookieString
  if (!req.cookies) {
    req.cookies = {}
  }

  if (!value) {
    delete req.cookies[key]
  } else {
    req.cookies[key] = value
  }
}
