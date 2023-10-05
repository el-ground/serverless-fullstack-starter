import { Resolvers } from '@/schema/__generated__/server/types'
import { AuthQueries, AuthMutations } from './auth'
import { UserQueries, UserMutations } from './user'
import { BookQueries, BookMutations, BookSubscriptions } from './book'
import { PushQueries, PushMutations } from './push'

/*
    ACL performed inside resolvers.
    Resolvers should filter results according to context.
    Only caching that's recommended is query-stack caching inside a single query.
    We don't recomment caching on http, graphql, dataloader.
    Caching should be done behind the dataloader.

    Reason : Requests from a single client can be load balanced through multiple server instances.
      If each instance has their local cache, The client might view multiple cached versions of the same data.
*/

export const resolvers: Resolvers = {
  Query: {
    ...UserQueries,
    ...AuthQueries,
    ...BookQueries,
    ...PushQueries,
  },
  Mutation: {
    ...UserMutations,
    ...AuthMutations,
    ...BookMutations,
    ...PushMutations,
  },
  Subscription: {
    ...BookSubscriptions,
  },
}
