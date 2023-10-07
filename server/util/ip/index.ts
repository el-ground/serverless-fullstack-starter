import type { IncomingMessage } from 'http'

export const getRequestIpAddress = (req: IncomingMessage) => {
  let ip = req.socket.remoteAddress

  let forwardedFor =
    req.headers[`x-forwarded-for`] || req.headers[`X-Forwarded-For`]
  if (forwardedFor) {
    if (Array.isArray(forwardedFor)) {
      // if array, just select first
      forwardedFor = forwardedFor[0]
    }

    ip = forwardedFor.split(`,`)[0] // first address
  }
  return ip
}
