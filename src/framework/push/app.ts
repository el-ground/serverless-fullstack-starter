import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications'
import { toast } from 'react-toastify'
import { registerPushToken } from './register-push-token'
import type { PushNotificationPermissionState } from './types'

export const checkPermission =
  async (): Promise<PushNotificationPermissionState> => {
    const { receive } = await PushNotifications.checkPermissions()
    return receive
  }

export const requestPermission =
  async (): Promise<PushNotificationPermissionState> => {
    const { receive } = await PushNotifications.requestPermissions()
    return receive
  }

export const register = async () => {
  await PushNotifications.register()
}

export const unregister = async () => {
  await PushNotifications.unregister()
  await registerPushToken({ pushToken: null })
}

export const initialize = () => {
  PushNotifications.addListener(`registration`, (token: Token) => {
    console.log(`Push registration success, token: ${token.value}`)
    // this is register!!
    registerPushToken({
      pushToken: token.value,
    })
  })

  // Some issue with our setup and push will not work
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PushNotifications.addListener(`registrationError`, (error: any) => {
    console.log(`Push registration error, ${JSON.stringify(error, null, 2)}`)
    toast.error(`푸쉬 토큰 등록 실패했습니다.`, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
    })
  })

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener(
    `pushNotificationReceived`,
    (notification: PushNotificationSchema) => {
      console.log(`push received: ${JSON.stringify(notification)}`)
      // TODO show notification inside the app, send the user to right place!
      // Display an overlay and if tap, move to the link?? hmmm how to handle this elegant way?
    },
  )

  // Method called when tapping on a notification
  PushNotifications.addListener(
    `pushNotificationActionPerformed`,
    (notification: ActionPerformed) => {
      console.log(`Push action performed: ${JSON.stringify(notification)}`)

      const url = notification.notification.data?.url as string
      if (url) {
        const target = `roout.co.kr`
        const index = url.indexOf(target)
        if (index !== -1) {
          const slug = url.substring(index + target.length)
          if (slug) {
            console.log(
              `push notification deep link consumption : url : ${url} -> slug : ${slug}`,
            )
            // it was previously navigate, but we change this to page reload!!
            window.location.href = `${window.location.origin}${slug}`
          }
        }
      }
    },
  )

  console.log(`push register handlers registered!`)
}
