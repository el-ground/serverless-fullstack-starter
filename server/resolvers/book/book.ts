/*
    Exmaple
*/
import type { QueryResolvers } from '@/schema/__generated__/server/types'

export const Book_book: QueryResolvers['Book_book'] = async (
  _,
  { id },
  context,
) => {
  return context.getLoader().load(id)
}
