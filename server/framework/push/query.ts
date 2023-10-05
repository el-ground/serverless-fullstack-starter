import type { UserPushTokenBag } from './types'

export const getUserPushTokenBagsFromUniqueInstallationId = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uniqueInstallationId: string,
): Promise<UserPushTokenBag[]> => {
  // MUST_IMPLEMENT
  /*
      const querySnapshot = await firestore
        .collection(`user-push-token-bags`)
        .where(
          `uniqueInstallationIdIndex`,
          `array-contains`,
          uniqueInstallationId,
        )
        .get()
    */
  return []
}

export const getUserPushTokenBagsFromPushToken = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pushToken: string,
): Promise<UserPushTokenBag[]> => {
  // MUST_IMPLEMENT
  /*
      const querySnapshot = await firestore
        .collection(`user-push-token-bags`)
        .where(`pushTokenIndex`, `array-contains`, pushToken)
        .get()
      */
  return []
}
