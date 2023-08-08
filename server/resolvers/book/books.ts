import type { QueryResolvers } from '@/schema/__generated__/server/types'

const bookIds = [`a`, `b`]

export const Book_books: QueryResolvers['Book_books'] = async (
  _,
  __,
  context,
) => {
  return context.loader.loadMany(bookIds)
}
