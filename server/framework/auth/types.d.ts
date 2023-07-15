import type { AuthPayload } from './auth-payload'

declare module 'express-serve-static-core' {
  interface Request {
    auth: AuthPayload // must provide for all requests.
  }
  interface Response {
    // used to manipulate auth tokens in routes
    setAuthToken: (token: string | null) => void
  }
}
