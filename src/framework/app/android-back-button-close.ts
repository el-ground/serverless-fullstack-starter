import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { getIsAnyPopStateHandleAlive } from '@hooks/use-on-pop-state'

export const registerAndroidBackButtonClose = () => {
  if (Capacitor.getPlatform() === `android`) {
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack && !getIsAnyPopStateHandleAlive()) {
        App.exitApp()
      } else {
        window.history.back()
      }
    })
  }
}
