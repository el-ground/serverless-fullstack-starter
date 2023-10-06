'use client'
import React from 'react'
import { useGetIsMounted } from '@hooks/use-get-is-mounted'
import { useAsyncCallback } from '@hooks/use-async-callback'
import { hookRefreshesWith } from '@util/hook-refreshes-with'
import { isApp } from '@framework/app'
import {
  checkPermission as checkPermissionWeb,
  requestPermission as requestPermissionWeb,
  register as registerWeb,
  unregister as unregisterWeb,
  initialize as initializeWeb,
} from '@framework/push/web'
import {
  checkPermission as checkPermissionApp,
  requestPermission as requestPermissionApp,
  register as registerApp,
  unregister as unregisterApp,
  initialize as initializeApp,
} from '@framework/push/app'
import { get } from '@framework/preferences'
import { useAuth } from '@/src/hooks/use-auth/client'
import { registerPushToken } from '@framework/push/register-push-token'
import type { PushNotificationPermissionState } from '@framework/push/types'

const PushContext = React.createContext<{
  checkPermission: () => Promise<PushNotificationPermissionState>
  requestPermission: () => Promise<PushNotificationPermissionState>
}>({
  checkPermission: async () => `default`,
  requestPermission: async () => `default`,
})

const PushNotificationPermissionStateContext =
  React.createContext<PushNotificationPermissionState>(`default`)

export const PushProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth()
  const getIsMounted = useGetIsMounted()
  const [pushNotificationPermissionState, setPushNotificationPermissionState] =
    React.useState<PushNotificationPermissionState>(`default`)

  /*
    check permission and if granted, register;
  */
  const checkPermission = useAsyncCallback(async () => {
    const permission = await (isApp()
      ? checkPermissionApp()
      : checkPermissionWeb())

    if (getIsMounted()) {
      setPushNotificationPermissionState(permission)
    }

    if (permission === `granted`) {
      // automatically registers to the server!
      await (isApp() ? registerApp() : registerWeb())
    }
    return permission
  }, [getIsMounted])

  /*
    request permission and if granted, register;
  */
  const requestPermission = useAsyncCallback(async () => {
    // if not logged in, we cannot request permission!!

    const permission = await (isApp()
      ? requestPermissionApp()
      : requestPermissionWeb())

    if (getIsMounted()) {
      setPushNotificationPermissionState(permission)
    }

    if (permission === `granted`) {
      // automatically registers to the server!
      await (isApp() ? registerApp() : registerWeb())
    }
    return permission
  }, [getIsMounted])

  /*
  syncs local token to the server;
  push token might be registered locally but the network request might have failed;
*/
  const sync = useAsyncCallback(async () => {
    // if latestRegisteredUserId !== userId, unsubscribe locally;
    // this will ensure logout || change auth -> reenter call unsubscribe;
    // then, we'll register again;
    const latestPushTokenRegisteredUserId = await get(
      `latestPushTokenRegisteredUserId`,
    )
    if (
      latestPushTokenRegisteredUserId &&
      (userId || null) !== latestPushTokenRegisteredUserId
    ) {
      // userId state changed!
      await (isApp() ? unregisterApp() : unregisterWeb())
    }

    const permission = await checkPermission()
    if (permission === `granted`) {
      // if permission was granted, it will fire register on its side;
      // nothing else to sync!
    } else {
      // sync to server with previous token;
      const pushToken = await get(`pushToken`)

      if (pushToken) {
        await registerPushToken({
          pushToken,
        })
      }
    }
  }, [checkPermission, userId])

  // when userId change, always sync!
  React.useEffect(() => {
    hookRefreshesWith(userId)
    sync()
  }, [userId, sync])

  const handle = React.useMemo(() => {
    return {
      checkPermission,
      requestPermission,
    }
  }, [checkPermission, requestPermission])

  return (
    <PushContext.Provider value={handle}>
      <PushNotificationPermissionStateContext.Provider
        value={pushNotificationPermissionState}
      >
        {children}
      </PushNotificationPermissionStateContext.Provider>
    </PushContext.Provider>
  )
}

// initialize should be done in module scope; cannot wait for render.
export const initialize = () => {
  console.log(`@push:initialize`)
  if (isApp()) {
    initializeApp()
  } else {
    initializeWeb()
  }
}

if (typeof window !== `undefined`) {
  initialize()
}
