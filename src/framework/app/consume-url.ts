import { App, URLOpenListenerEvent } from '@capacitor/app'
import { isApp } from './'

let lastConsumeResumeRequestAtMilliseconds = Date.now()
const consumeResumeNavigationRequestAtMilliseconds = 0

const bundleActiveTimeoutMilliseconds = 1 * 60 * 60 * 1000

export const consumeResumeRequest = () => {
  console.log(`@consumeResumeRequest`)
  const hasEnoughTimePassedSinceLastConsumeRequest =
    Date.now() - lastConsumeResumeRequestAtMilliseconds >
    bundleActiveTimeoutMilliseconds

  // update last consume resume
  lastConsumeResumeRequestAtMilliseconds = Date.now()

  if (!hasEnoughTimePassedSinceLastConsumeRequest) {
    // not enough time passed, just skip reloads.
    return
  }

  if (window.location.pathname !== `/p/create`) {
    // not create!
    window.setTimeout(() => {
      // reload after 17ms
      if (Date.now() - consumeResumeNavigationRequestAtMilliseconds < 1000) {
        console.log(
          `skip consumeResumeRequest since we consumed navigation request!`,
        )
        return
      }

      console.log(`consumeResumeRequest reload!`)
      window.location.reload()
    }, 100)
  }
}

let appUrlRegistered = false
export const registerAppUrl = () => {
  if (isApp() && !appUrlRegistered) {
    App.addListener(`appUrlOpen`, (event: URLOpenListenerEvent) => {
      // https://capacitorjs.com/docs/guides/deep-links

      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2

      const target = `roout.co.kr`
      const url = event.url
      const index = url.indexOf(target)
      if (index !== -1) {
        const slug = url.substring(index + target.length)
        if (slug) {
          console.log(`deep link consumption : url : ${url} -> slug : ${slug}`)
          // it was previously navigate, but we change this to page reload!!
          window.location.href = `${window.location.origin}${slug}`
        }
      }

      // If no match, do nothing - let regular routing
      // logic take over
    })

    // https://capacitorjs.com/docs/apis/app#addlistenerpause-
    /*
        On iOS it's fired when the native UIApplication.willResignActiveNotification and UIApplication.didBecomeActiveNotification events get fired. 
        On Android it's fired when the Capacitor's Activity onResume and onStop methods gets called.
      */
    App.addListener(`appStateChange`, ({ isActive }) => {
      console.log(`appStateChange! isActive : ${isActive}`)
      if (isActive) {
        //
        consumeResumeRequest()
      } else {
        /* no-op */
      }
    })

    /*
        On iOS it's fired when the native UIApplication.didEnterBackgroundNotification event gets fired. 
        On Android it's fired when the Capacitor's Activity onPause method gets called.
      */
    App.addListener(`pause`, () => {
      /* no-op */

      console.log(`pause!`)
    })

    /*
        On iOS it's fired when the native UIApplication.willEnterForegroundNotification event gets fired. 
        On Android it's fired when the Capacitor's Activity onResume method gets called, but only after resume has fired first. 
      */
    App.addListener(`resume`, () => {
      /* no-op */
      console.log(`resume!`)
    })

    console.log(`app url consumer registered!`)
    //  }, [])
    appUrlRegistered = true
  }
}
