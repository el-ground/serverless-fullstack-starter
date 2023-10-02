'use server'
import { cookies } from 'next/headers'

export const getSSRCookies = (keys: string[]) => {
  const cookieStore = cookies()

  return keys.map((key) => cookieStore.get(key)?.value || ``)
}

globalThis.getSSRCookies = getSSRCookies
