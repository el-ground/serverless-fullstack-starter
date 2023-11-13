import { getAuthDependencies } from './util'

// used for getting auth outside react hooks
export const getAuth = () => {
  const { authPayload } = getAuthDependencies()
  return authPayload
}

export const getSid = () => {
  const { sidCookie } = getAuthDependencies()
  return sidCookie
}
