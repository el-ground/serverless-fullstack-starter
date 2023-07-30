import type { BookQueriesResolvers } from '@/schema/__generated__/server/types'

const bookIds = [`a`, `b`]

export const books: BookQueriesResolvers['books'] = async (_, __, context) => {
  return context.loader.loadMany(bookIds)
}
