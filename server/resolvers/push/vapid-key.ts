import type { QueryResolvers } from '#types'
import { getVapidKeyPublic } from '#framework/push/key'

export const Push_vapidKey: QueryResolvers['Push_vapidKey'] = async () => {
  // return key

  return {
    publicKey: getVapidKeyPublic(),
  }
}
