'use server'
import { cookies } from 'next/headers'
import { getAuthPayloadFromCookieString } from './util'

export const getAuthRSC = () => {
  const cookieStore = cookies()
  /*
    Does this take refreshed cookie into context? hmm,,,
    Anticipated problem : we don't check if the jwt if valid.
    1. format (version check)
    2. time
    3. signature validation

    Must not trust this right away!

    Best way is to rely identification on apollo.
  */
  const payload = cookieStore.get('authorization-payload')?.value
  return getAuthPayloadFromCookieString(payload)
}
