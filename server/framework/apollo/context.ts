import type { Loader } from '@/server/framework/database/loader'
import type { AuthPayload } from '@/server/framework/auth/auth-payload'
/*
    Apollo graphQL Context
*/
export interface Context extends AuthPayload {
  loader: Loader
}
