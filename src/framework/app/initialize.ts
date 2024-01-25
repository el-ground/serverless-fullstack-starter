'use client'

import { isApp } from '.'
import { registerAppUrl } from '@framework/app/consume-url'
import { updateAppInfo } from '@framework/app/info'
import { setStatusBarColorAndroid } from '@framework/app/setup'
import { registerTrackingPermission } from '@framework/app/tracking-permission'
import { registerAndroidBackButtonClose } from './android-back-button-close'

export const initialize = () => {
  console.log(`@app:initialize`)
  setStatusBarColorAndroid()
  updateAppInfo()
  registerAppUrl()
  registerTrackingPermission()
  registerAndroidBackButtonClose()
}

if (isApp()) {
  // initialize in module scope
  initialize()
}
