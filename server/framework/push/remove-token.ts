import { runTransaction } from '../database/transaction'
import { readInTransaction } from '../database/read'
import { overwriteInTransaction } from '../database/write/overwrite'
import { UserPushTokenBag } from './types'

// removes instances that share pushToken or uniqueInstallationId.
export const removePushToken = async ({
  userId,
  pushToken,
  uniqueInstallationId,
}: {
  userId: string
  pushToken: string | null
  uniqueInstallationId?: string
}) => {
  await runTransaction(async (transaction) => {
    const data = await readInTransaction<UserPushTokenBag>(
      `/user-push-token-bags/${userId}`,
      transaction,
    )
    const currentInstances = data?.tokenInstances || []
    const instancesToUpdate = currentInstances.filter(
      (e) =>
        // pushToken different and installationId different.
        e.pushToken !== pushToken &&
        e.uniqueInstallationId !== uniqueInstallationId,
    )

    if (instancesToUpdate.length !== currentInstances.length) {
      const pushTokenIndex = instancesToUpdate
        .filter((e) => !e.expired)
        .map((e) => e.pushToken) // not expired!
        .filter((e) => e) as string[] // null filtered
      const uniqueInstallationIdIndex = instancesToUpdate
        .map((e) => e.uniqueInstallationId)
        .filter((e) => e)

      await overwriteInTransaction<UserPushTokenBag>(
        `/push-tokens/${userId}`,
        {
          userId,
          tokenInstances: instancesToUpdate,
          pushTokenIndex,
          uniqueInstallationIdIndex,
        },
        transaction,
      )
    }
    // find instances that has same pushToken OR same uniqueInstallationId!
  })
}
