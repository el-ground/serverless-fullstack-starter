import { AccountType, User, Book } from '@/schema/__generated__/server/types'

export const database: Record<string, User | Book> = {
  'user:a': {
    id: `user:a`,
    public: {
      accountType: AccountType.User,
    },
  },
  'book:a': {
    id: `book:a`,
    title: `helloworld`,
    author: `jwjang`,
  },
  'book:b': {
    id: `book:b`,
    title: `titletitle`,
    author: `authorauthor`,
  },
}
