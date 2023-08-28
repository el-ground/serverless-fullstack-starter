import { Transaction } from '@/server/framework/database/transaction'
import { User } from '#types'
import { readInTransaction } from '@/server/framework/database/read'
import {
  revokeNicknameOwnershipInTransaction,
  acquireNicknameOwnershipInTransaction,
} from '#model/nickname-ownership'
import { create as createUUID } from '@/server/util/uuid'
import { updateInTransaction } from '@/server/framework/database/write/update'

export const deleteUserInTransaction = async (
  userId: string,
  transaction: Transaction,
) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  const prevUserData = await readInTransaction<User>(
    `/users/${userId}`,
    transaction,
  )
  if (!prevUserData) {
    throw new Error(`User not found`)
  }

  const prevNickname = prevUserData.public.nickname
  const newNickname = `D_${createUUID(6)}`
  revokeNicknameOwnershipInTransaction(prevNickname, transaction)
  await acquireNicknameOwnershipInTransaction(newNickname, userId, transaction)

  /*
    Place your user-deletion logic here!!!
  */

  updateInTransaction(
    `/users/${userId}`,
    {
      'public.nickname': newNickname,
      'public.deleted': true,
      'public.deletedAtSeconds': currentTimeSeconds,
    },
    transaction,
  )
}
