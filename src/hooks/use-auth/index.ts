import { getAuthDependencies } from './util'
import { AuthPayload } from '#framework/auth'

let cachedAuthPayload: AuthPayload | null = null

export const getAuth = () => {
  if (typeof window === `undefined`) {
    // if ssr env, always re-evaluate
    const { authPayload } = getAuthDependencies()
    return authPayload
  }

  // browser env. can cache.
  if (!cachedAuthPayload) {
    const { authPayload } = getAuthDependencies()
    cachedAuthPayload = authPayload
  }
  return cachedAuthPayload
}

// same! :)
export const useAuth = getAuth
