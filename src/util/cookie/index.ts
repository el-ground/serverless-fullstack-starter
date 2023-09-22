import Cookies from 'js-cookie'

// no use-client;
export const getCookies = (keys: string[]) => {
  if (typeof window === `undefined`) {
    // ssr, src
    return globalThis.getSSRCookies(keys)
  } else {
    return keys.map((key) => Cookies.get(key) || ``)
  }
}
