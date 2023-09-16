import type { AuthPayload } from './auth/auth-payload'

declare module 'express' {
  export interface Request {
    sessionId: string // must provide for all requests. defined in framework/sesssion
    auth: AuthPayload
  }

  export interface Response {
    // used to manipulate auth tokens in routes
    setAuthToken: (token: string | null) => void // defined in framework/auth
  }
}
