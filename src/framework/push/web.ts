import type { PushNotificationPermissionState } from './types'
import { gql, getClient } from '@framework/apollo/client'
import { urlB64ToUint8Array } from './util'
import { registerPushToken } from './register-push-token'

const query = gql(`
    query GetVapidKey {
        Push_vapidKey {
            publicKey
        }
    }
`)

export const checkPermission =
  async (): Promise<PushNotificationPermissionState> => {
    return Notification.permission
  }

export const requestPermission =
  async (): Promise<PushNotificationPermissionState> => {
    return Notification.requestPermission()
  }

// https://github.com/pirminrehm/service-worker-web-push-example
export const register = async () => {
  // TODO : might separate service worker register
  const registration = await navigator.serviceWorker.register('sw.js')
  await registration.update()
  const pushManager = registration.pushManager

  let subscription = await pushManager.getSubscription()
  if (!subscription) {
    const result = await getClient().query({
      query,
    })

    const base64PublicKey = result.data.Push_vapidKey.publicKey
    const uint8ArrayPublicKey = urlB64ToUint8Array(base64PublicKey)

    subscription = await pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: uint8ArrayPublicKey,
    })
    console.log(`push subscribed`)
  }

  // updatePushTokenState : uniqueInstallationId, pushToken

  const jsonValue = JSON.stringify(subscription.toJSON())

  // register on registration! :)
  await registerPushToken({
    pushToken: jsonValue,
  })
}

export const unregister = async () => {
  const registration = await navigator.serviceWorker.register('sw.js')
  await registration.update()
  const pushManager = registration.pushManager

  const subscription = await pushManager.getSubscription()
  if (subscription) {
    const result = await subscription.unsubscribe()
    if (!result) {
      console.error(`push unsubscribe fail`)
    }
  }

  await registerPushToken({
    pushToken: null,
  })
}

export const initialize = () => {
  // no-op
}
