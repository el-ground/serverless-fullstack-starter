import { logError, logInfo } from '#util/log'
import { readDirectly } from '#framework/database/read'
import { UserPushTokenBag } from '../types'
import { expirePushToken } from '../expire-token'

const tokenExpireErrorCodes = [
  `messaging/invalid-recipient`,
  `messaging/invalid-argument`,
  `messaging/invalid-registration-token`,
  `messaging/registration-token-not-registered`,
]
const validationErrorCodes = [
  `messaging/authentication-error`,
  `messaging/mismatched-credential`,
  `messaging/invalid-apns-credentials`,
  `messaging/too-many-topics`,
  `messaging/invalid-package-name`,
  `messaging/invalid-options`,
  `messaging/payload-size-limit-exceeded`,
  `messaging/invalid-data-payload-key`,
]
const retriableErrorCodes = [
  `messaging/server-unavailable`,
  `messaging/internal-error`,
  `messaging/unknown-error`,
  `messaging/topics-message-rate-exceeded`,
  `messaging/device-message-rate-exceeded`,
  `messaging/message-rate-exceeded`,
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const sendMulticast = async (message: any): Promise<any> => {
  // setup firebase project
  // return messaging.sendMulticast(message)
  return null
}

export const handlePushNotificationFailure = async ({
  code, // https://firebase.google.com/docs/cloud-messaging/send-message#admin
  pushToken,
  userId,
}: {
  code: string
  pushToken: string
  userId: string
}) => {
  // if fail, we need to revoke tokens on certain scenarios!
  if (tokenExpireErrorCodes.includes(code)) {
    await expirePushToken({
      pushToken,
      userId,
    })
  }
}

export const sendNotification = async ({
  userId,
  title,
  body,
  url,
  imageUrl,
}: {
  userId: string
  title: string
  body: string
  url: string
  imageUrl?: string
}) => {
  const data = await readDirectly<UserPushTokenBag>(
    `/user-push-token-bags/${userId}`,
  )

  if (!data) {
    logError(`Push token registration not found for user : ${userId}`)
    return {
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      message: `registration not found`,
    }
  }

  const pushTokenIndex = data.pushTokenIndex
  if (!pushTokenIndex) {
    logError(
      `pushTokenIndex not found for push token registration user : ${userId}`,
    )
    return {
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      message: `index not found`,
    }
  }
  if (pushTokenIndex.length === 0) {
    logError(
      `pushTokenIndex length zero for push token registration user : ${userId}`,
    )
    return {
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      message: `index length zero`,
    }
  }

  // TODO : type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let message: any = {
    notification: {
      title,
      body,
    },
    data: {
      url,
    },
    tokens: pushTokenIndex,
  }

  if (imageUrl) {
    message = {
      ...message,
      android: {
        notification: {
          imageUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
          },
        },
        fcm_options: {
          image: imageUrl,
        },
      },
      webpush: {
        headers: {
          image: imageUrl,
        },
      },
    }
  }

  logInfo(`notification message payload : ${JSON.stringify(message, null, 2)}`)

  // https://firebase.google.com/docs/cloud-messaging/send-message
  const response = await sendMulticast(message)
  let totalCount = 0
  let successCount = 0
  let failCount = 0
  let expireCount = 0
  let validationFailCount = 0
  let retryCount = 0
  let unknownErrorCount = 0

  for (let i = 0; i < response.responses.length; i += 1) {
    totalCount += 1
    const resp = response.responses[i]
    logInfo(`notification response payload : ${JSON.stringify(resp, null, 2)}`)
    const pushToken = pushTokenIndex[i]
    const success = resp.success
    if (!success) {
      failCount += 1
      const error = resp.error
      const code = error?.code
      // Currently we're not tracking individual retries.
      // If all requests are expire or retry request, we'll retry.
      // else, we won't retry. partial success dont retry.

      if (tokenExpireErrorCodes.includes(code)) {
        expireCount += 1
      } else if (validationErrorCodes.includes(code)) {
        validationFailCount += 1
      } else if (retriableErrorCodes.includes(code)) {
        retryCount += 1
      } else {
        unknownErrorCount += 1
      }

      logError(
        `push notification send fail! : e : ${JSON.stringify(error, null, 2)} `,
      )
      if (code) {
        // handle failed tokens!
        await handlePushNotificationFailure({
          userId,
          code,
          pushToken,
        })
      }
    } else {
      successCount += 1
    }
  }

  return {
    successCount,
    failCount,
    expireCount,
    validationFailCount,
    retryCount,
    unknownErrorCount,
    totalCount,
  }
}
