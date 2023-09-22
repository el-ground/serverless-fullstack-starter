/*
    Exmaple
*/
import { pubsub } from '#framework/pubsub'
import type {
  SubscriptionResolvers,
  BookPingResult,
} from '@/schema/__generated__/server/types'

const PING_TOPIC = `PING_TOPIC`

setInterval(() => {
  pubsub.publish(PING_TOPIC, {
    message: `ping: ${Date.now()}`,
  })
}, 1000)

export const Book_ping: SubscriptionResolvers['Book_ping'] = {
  resolve: (payload: BookPingResult /* , args, context: Context, info */) => {
    // Manipulate and return the new value
    return payload
  },
  subscribe: () => {
    return {
      [Symbol.asyncIterator]: () => pubsub.asyncIterator<string>(PING_TOPIC),
    }
  },
}
