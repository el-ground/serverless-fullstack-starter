import { Capacitor, registerPlugin } from '@capacitor/core'
import { isApp } from '.'

export interface SetupPlugin {
  /*
      amount : Number
   
      orderId: String, 
      orderName: String, 
      customerEmail: String?, 
      customerName: String?,
      taxFreeAmount: Number?
    */

  easyCall(options: { method: string }): Promise<void>
}

export const Setup = registerPlugin<SetupPlugin>(`Setup`)

let hasSetup = false
export const setStatusBarColorAndroid = () => {
  if (!hasSetup) {
    hasSetup = true
    if (isApp()) {
      if (Capacitor.getPlatform() === `android`) {
        window.setTimeout(() => {
          Setup.easyCall({ method: `setStatusBarColor` })
        }, 500)
      }
    }
  }
}
