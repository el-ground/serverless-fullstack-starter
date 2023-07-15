import { Resolvers } from '@/schema/__generated__/server/types'
import { book } from './example/book'
import { books } from './example/books'

export const resolvers: Resolvers = {
  Query: {
    books,
    book,
  },
}
