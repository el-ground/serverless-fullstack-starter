import type { Loader } from '@/server/framework/database/loader'
/*
    Apollo graphQL Context
*/
export interface Context {
  loader: Loader
  //
  /*
    place other acl payloads in the jwt.
  */
  userId?: string
  isAuthorized: boolean
  isAdmin: boolean
}
