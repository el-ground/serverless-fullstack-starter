import { Transaction } from '@/server/framework/database/transaction'
import { createInTransaction } from '@/server/framework/database/write/create'
import { AccountType, User } from '#types'

export const createUserInTransaction = (
  {
    userId,
    nickname,
    accountType,
  }: {
    userId: string
    nickname: string
    accountType: AccountType
  },
  transaction: Transaction,
) => {
  createInTransaction<User>(
    `/users/${userId}`,
    {
      userId,
      public: {
        nickname,
        accountType,
        deleted: false,
      },
      private: {
        isAdmin: false,
      },
    },
    transaction,
  )
}
