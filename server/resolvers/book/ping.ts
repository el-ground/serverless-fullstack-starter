/*
    Exmaple
*/
import { subscribe } from '#framework/pubsub'
import { wrapSubscribe, wrapResolve } from '#framework/apollo/subscription'
import type {
  SubscriptionResolvers,
  BookPingResult,
} from '@/schema/__generated__/server/types'
import { logInfo } from '#util/log'

const PING_TOPIC = `PING_TOPIC`

export const Book_ping: SubscriptionResolvers['Book_ping'] = {
  resolve: wrapResolve(
    // I want to get PSRegId
    (payload: BookPingResult /* , args, context: Context, info */) => {
      // Manipulate and return the new value
      logInfo(`resolve!`)
      logInfo(`payload : ${JSON.stringify(payload)}`)
      return payload
    },
  ),
  subscribe: wrapSubscribe(() => {
    return subscribe(PING_TOPIC)
  }),
}
