/*
    Exmaple
*/
import type { QueryResolvers } from '@/schema/__generated__/server/types'

export const book: QueryResolvers['book'] = async (_, { id }, context) => {
  return context.loader.load(id)
}
