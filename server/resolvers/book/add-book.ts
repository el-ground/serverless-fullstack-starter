import type {
  BookMutationsResolvers,
  Book,
} from '@/schema/__generated__/server/types'
import { database } from '@/server/framework/database/example'

export const addBook: BookMutationsResolvers['addBook'] = async (
  _,
  { title, author },
) => {
  const id = `${Date.now()}`
  const document: Book = {
    id,
    title,
    author,
  }
  database[id] = document
  return document
}
