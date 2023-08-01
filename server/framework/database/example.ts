import { AccountType } from '@/schema/__generated__/server/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const database: Record<string, any> = {
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
