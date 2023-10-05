import type { MutationResolvers } from '#types'
import {
  getUserPushTokenBagsFromUniqueInstallationId,
  getUserPushTokenBagsFromPushToken,
} from '#framework/push/query'
import { removePushToken } from '#framework/push/remove-token'
import { setPushToken } from '#framework/push/set-token'
import type { UserPushTokenBag } from '#framework/push/types'

export const Push_registerPushToken: MutationResolvers['Push_registerPushToken'] =
  async (_, { input: { uniqueInstallationId, pushToken } }, { userId }) => {
    const scannedDocumentsDict: Record<string, UserPushTokenBag> = {}

    if (uniqueInstallationId) {
      const userPushTokenBagsFromUniqueInstallationId =
        await getUserPushTokenBagsFromUniqueInstallationId(uniqueInstallationId)
      userPushTokenBagsFromUniqueInstallationId.forEach((document) => {
        scannedDocumentsDict[document.userId] = document
      })
    }

    if (pushToken) {
      const userPushTokenBagsFromPushToken =
        await getUserPushTokenBagsFromPushToken(pushToken)
      userPushTokenBagsFromPushToken.forEach((document) => {
        scannedDocumentsDict[document.userId] = document
      })
    }

    const scannedDocuments = Object.values(scannedDocumentsDict)
    const notMineUserIds = scannedDocuments
      .map((doc) => doc.userId)
      .filter((e) => e !== userId)

    // log out from instances
    for (let i = 0; i < notMineUserIds.length; i += 1) {
      await removePushToken({
        userId: notMineUserIds[i],
        pushToken: pushToken || null,
        uniqueInstallationId,
      })
    }

    // set push token!
    if (userId) {
      await setPushToken({
        uniqueInstallationId,
        pushToken: pushToken || null,
        userId,
      })
    }

    //
    return {
      success: true,
    }
  }
