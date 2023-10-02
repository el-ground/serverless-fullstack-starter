import type { Request } from 'express'
// find the key in cookie, replace the value.
export const getReplacedCookieHeaderString = (
  cookieHeader: string,
  key: string,
  value: string,
) => {
  if (cookieHeader.length === 0) {
    // if header was empty, return;
    return `${key}=value`
  }

  const startIndex = cookieHeader.indexOf(`${key}=`)
  if (startIndex === -1) {
    // the header was not found. append to it.
    return cookieHeader + `; ${key}=${value}`
  }

  const endIndex = cookieHeader.indexOf(`;`, startIndex)
  const frontSegment = cookieHeader.substring(0, startIndex) + `${key}=${value}`
  if (endIndex === -1) {
    return frontSegment
  }
  return frontSegment + cookieHeader.substring(endIndex)
}

// replace cookie string and req.cookies object
export const replaceCookiesInRequest = (
  req: Request,
  key: string,
  value: string,
) => {
  const prevCookieHeader = req.headers.cookie || ``
  const replacedCookieString = getReplacedCookieHeaderString(
    prevCookieHeader,
    key,
    value,
  )
  req.headers.cookie = replacedCookieString
  if (!req.cookies) {
    req.cookies = {}
  }
  req.cookies[key] = value
}
