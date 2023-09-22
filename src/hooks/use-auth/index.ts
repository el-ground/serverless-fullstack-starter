import { getAuthDependencies } from './util'
import { AuthPayload } from '#framework/auth'

let cachedAuthPayload: AuthPayload | null = null

export const getAuth = () => {
  if (typeof window !== `undefined`) {
    // browser env
    if (!cachedAuthPayload) {
      const { authPayload } = getAuthDependencies()
      cachedAuthPayload = authPayload
    }
    return cachedAuthPayload
  }

  // if ssr env, always re-evaluate
  const { authPayload } = getAuthDependencies()
  return authPayload
}

// same! :)
export const useAuth = getAuth
