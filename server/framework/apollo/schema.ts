import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from '@/server/resolvers'

const typeDefPaths = globSync('./dist/schema/**/*.gql')
const typeDefs: string[] = []
for (let i = 0; i < typeDefPaths.length; i += 1) {
  const typeDef = readFileSync(typeDefPaths[i], { encoding: `utf-8` })
  typeDefs.push(typeDef)
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
