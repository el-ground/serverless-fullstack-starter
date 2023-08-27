import type { AuthPayload } from './auth-payload'

declare module 'express-serve-static-core' {
  interface Request {
    sessionId: string // must provide for all requests. defined in framework/sesssion
    auth: AuthPayload // must provide for all requests. defined in framework/auth
  }
  interface Response {
    // used to manipulate auth tokens in routes
    setAuthToken: (token: string | null) => void // defined in framework/auth
  }
}
