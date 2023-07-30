/*
    Exmaple
*/
import type { BookQueriesResolvers } from '@/schema/__generated__/server/types'

export const book: BookQueriesResolvers['book'] = async (
  _,
  { id },
  context,
) => {
  return context.loader.load(id)
}
