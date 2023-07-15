import { Book } from '@/schema/__generated__/server/types'
// mock
export const database: Record<string, Book> = {
  a: {
    id: `a`,
    title: 'The Awakeningg',
    author: 'Kate Chopin',
  },
  b: {
    id: `b`,
    title: 'City of Glass',
    author: 'Paul Auster',
  },
}
