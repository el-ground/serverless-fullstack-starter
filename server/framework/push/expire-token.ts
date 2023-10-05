import { runTransaction } from '../database/transaction'
import { readInTransaction } from '../database/read'
import { overwriteInTransaction } from '../database/write/overwrite'
import { UserPushTokenBag } from './types'

export const expirePushToken = async ({
  userId,
  pushToken,
}: {
  userId: string
  pushToken: string
}) => {
  await runTransaction(async (transaction) => {
    const data = await readInTransaction<UserPushTokenBag>(
      `/user-push-token-bags/${userId}`,
      transaction,
    )
    const tokenInstances = [...(data?.tokenInstances || [])]
    const prevTokenInstanceIndex = tokenInstances.findIndex(
      (e) => e.pushToken === pushToken,
    )

    if (prevTokenInstanceIndex === -1) {
      // token not found! nothing to expire :)
      return
    }

    // set it to expire!
    const prevTokenInstance = tokenInstances[prevTokenInstanceIndex]
    const newTokenInstance = {
      ...prevTokenInstance,
      expired: true, // only set to expired!
      expiredAtSeconds: Math.floor(Date.now() / 1000),
    }
    tokenInstances[prevTokenInstanceIndex] = newTokenInstance

    const pushTokenIndex = tokenInstances
      .filter((e) => !e.expired)
      .map((e) => e.pushToken) // not expired!
      .filter((e) => e) as string[]
    const uniqueInstallationIdIndex = tokenInstances
      .map((e) => e.uniqueInstallationId)
      .filter((e) => e)

    await overwriteInTransaction<UserPushTokenBag>(
      `/user-push-token-bags/${userId}`,
      {
        userId,
        tokenInstances,
        pushTokenIndex,
        uniqueInstallationIdIndex,
      },

      transaction,
    )
  })
}
