import { Transaction } from '@/server/framework/database/transaction'
import { updateInTransaction } from '@/server/framework/database/write/update'
import { readInTransaction } from '@/server/framework/database/read'
import { createInTransaction } from '@/server/framework/database/write/create'

/*

*/
export interface NicknameOwnership {
  encodedNickname: string // id of the document
  nickname: string
  userId: string
  revoked: boolean
  acquiredAtSeconds: number
  // revokedAtSeconds : number
}

export const revokeNicknameOwnershipInTransaction = (
  nickname: string,
  transaction: Transaction,
) => {
  //
  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  const encodedNickname = encodeURIComponent(nickname)
  updateInTransaction(
    `/nickname-ownerships/${encodedNickname}`,
    {
      revoked: true,
      revokedAtSeconds: currentTimeSeconds,
    },
    transaction,
  )
}

/*
  read and writes.
*/
export const acquireNicknameOwnershipInTransaction = async (
  nickname: string,
  userId: string,
  transaction: Transaction,
) => {
  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  const encodedNickname = encodeURIComponent(nickname)
  const prevNicknameOwnership = await readInTransaction<NicknameOwnership>(
    `/nickname-ownerships/${encodedNickname}`,
    transaction,
  )
  if (prevNicknameOwnership) {
    const { revoked } = prevNicknameOwnership
    if (!revoked) {
      return `OCCUPIED`
    }
  }

  if (prevNicknameOwnership) {
    // already exists! only switch ownership
    updateInTransaction<NicknameOwnership>(
      `/nickname-ownerships/${encodedNickname}`,
      {
        userId,
        revoked: false,
        acquiredAtSeconds: currentTimeSeconds,
      },
      transaction,
    )
  } else {
    // create!
    createInTransaction<NicknameOwnership>(
      `/nickname-ownerships/${encodedNickname}`,
      {
        encodedNickname,
        nickname,
        userId,
        revoked: false,
        acquiredAtSeconds: currentTimeSeconds,
      },
      transaction,
    )
  }

  return `ACQUIRING`
}
