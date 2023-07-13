import { Resolvers } from '@/schema/__generated__/server/types'

const books = [
  {
    title: 'The Awakeningg',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

export const resolvers: Resolvers = {
  Query: {
    books: async (_, __, context) => [
      {
        title: 'Inae',
        author: 'Love',
      },
    ],
  },
}
