import { runTransaction } from '../database/transaction'
import { readInTransaction } from '../database/read'
import { overwriteInTransaction } from '../database/write/overwrite'
import { UserPushTokenBag } from './types'
import { logInfo } from '#util/log'

export const setPushToken = async ({
  uniqueInstallationId,
  pushToken,
  userId,
}: {
  userId: string
  pushToken: string | null
  uniqueInstallationId: string
}) => {
  await runTransaction(async (transaction) => {
    const data = await readInTransaction<UserPushTokenBag>(
      `/user-push-token-bags/${userId}`,
      transaction,
    )
    const prevRedundantTokenInstance = (data?.tokenInstances || []).find(
      (e) =>
        // push same and installation same, nothing to update.
        e.pushToken === pushToken &&
        e.uniqueInstallationId === uniqueInstallationId,
    )

    if (prevRedundantTokenInstance) {
      // prev instance of same push token and same installationId found! return.

      logInfo(`pushToken same! returning.`)
      return
    }

    // pick same installation ids and only return the last one.
    const prevSameInstallationTokenInstances = (
      data?.tokenInstances || []
    ).filter((e) => e.uniqueInstallationId === uniqueInstallationId)

    // same push tokens get removed, same installationIds get removed.
    const newTokenInstances = [...(data?.tokenInstances || [])].filter(
      (e) =>
        e.pushToken !== pushToken &&
        e.uniqueInstallationId !== uniqueInstallationId,
    )

    // if multiple instances of same uniqueInstallationId, choose the last one.
    const prevSameInstallationTokenInstance =
      prevSameInstallationTokenInstances.length > 0
        ? prevSameInstallationTokenInstances[
            prevSameInstallationTokenInstances.length - 1
          ]
        : null

    const newTokenInstance = {
      // if same installation id existed, only update the pushToken.
      expired: false,
      ...(prevSameInstallationTokenInstance || {}),
      uniqueInstallationId,
      pushToken: pushToken || null,
    }

    newTokenInstances.push(newTokenInstance)

    const pushTokenIndex = newTokenInstances
      .filter((e) => !e.expired)
      .map((e) => e.pushToken) // not expired!
      .filter((e) => e) as string[]
    const uniqueInstallationIdIndex = newTokenInstances
      .map((e) => e.uniqueInstallationId)
      .filter((e) => e)

    await overwriteInTransaction<UserPushTokenBag>(
      `/user-push-token-bags/${userId}`,
      {
        userId,
        tokenInstances: newTokenInstances,
        pushTokenIndex,
        uniqueInstallationIdIndex, // app installed ?-> uniqueInstallationIdIndex > 0
      },
      transaction,
    )
  })
}
