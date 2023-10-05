/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

console.log(`@sw.js`)

// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Re-engageable_Notifications_Push#push
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  console.log(`push; data :`)
  console.log(data)
  const title = data.title || `새 알림이 도착했습니다!`
  const message = data.message || '어서 확인해주세요!'

  const dataUrl = data.url
  let url: string
  if (dataUrl) {
    if (dataUrl.includes(`://`)) {
      // use if full url
      url = dataUrl
    } else {
      // prepend origin if path
      url = `${self.location.origin}${dataUrl[0] === `/` ? `` : `/`}${dataUrl}`
    }
  } else {
    // if no url in payload, return home
    url = `${self.location.origin}/`
  }

  const options = {
    body: message,
    data: {
      url,
    },
    /*
    icon: 'images/checkmark.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore this new world',
        icon: 'images/checkmark.png',
      },
      {
        action: 'close',
        title: "I don't want any of this",
        icon: 'images/xmark.png',
      },
    ],
    */
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow

self.addEventListener('notificationclick', (e) => {
  console.log('message event fired! event action is:', `'${e.action}'`)
  // Close the notification popout
  e.notification.close()
  // Get all the Window clients
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false,
      )
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        self.clients
          .openWindow(e.notification.data.url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null))
    }),
  )
})

// mark this file as module
export const none = null
