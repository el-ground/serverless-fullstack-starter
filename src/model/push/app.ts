import type { PushNotificationPermissionState } from './types'

export const checkPermission =
  async (): Promise<PushNotificationPermissionState> => {
    throw new Error(`Not implemented`)
    // MUST_IMPLEMENT
  }

export const requestPermission =
  async (): Promise<PushNotificationPermissionState> => {
    throw new Error(`Not implemented`)
    // MUST_IMPLEMENT
  }

export const register = async () => {
  // MUST_IMPLEMENT
  // await PushNotifications.register()
}

export const unregister = async () => {
  // MUST_IMPLEMENT
  // await PushNotifications.unregister()
  // await registerPushToken({ pushToken : null })
}

export const initialize = () => {
  // MUST_IMPLEMENT
  // add listeners
  /*
 if (!pushRegistered) {
      PushNotifications.addListener(`registration`, (token: Token) => {
        console.log(`Push registration success, token: ${token.value}`)
        // this is register!!
        registerPushToken({
          pushToken: token.value
        })
      })

      // Some issue with our setup and push will not work
      PushNotifications.addListener(`registrationError`, (error: any) => {
        console.log(
          `Push registration error, ${JSON.stringify(error, null, 2)}`,
        )
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
                consumeResumeNavigationRequest(slug)
              }
            }
          }
        },
      )

      console.log(`push register handlers registered!`)
      pushRegistered = true
    }
  }

  */
}
