// MUST_IMPLEMENT
import { Capacitor } from '@capacitor/core'

export const isApp = () => {
  return typeof window !== `undefined` && Capacitor.isNativePlatform()
}
