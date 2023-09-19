import { typeDefs } from '@/schema/type-defs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from '@/server/resolvers'

export const schema = makeExecutableSchema({ typeDefs, resolvers })
