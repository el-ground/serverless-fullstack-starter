import type { Loader } from '@/server/framework/database/loader'
import type { AuthPayload } from '@/server/framework/auth/auth-payload'
/*
    Apollo graphQL Context

    There are two places that defines context :
    1. Graphql endpoint
    2. RSC schemaLink

    loader and authPayload set in both environments;
    refreshTokenId and setAuthToken is set only in 1. Graphql endpoint,
    not accessible in RSC.
*/
export interface Context extends AuthPayload {
  loader: Loader
  setAuthToken: (token: string | null) => void
}
