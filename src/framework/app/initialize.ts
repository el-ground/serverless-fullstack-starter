'use client'
import { isApp } from '.'
import { registerAppUrl } from '@framework/app/consume-url'
import { updateAppInfo } from '@framework/app/info'
import { setStatusBarColorAndroid } from '@framework/app/setup'
import { registerTrackingPermission } from '@framework/app/tracking-permission'

export const initialize = () => {
  console.log(`@app:initialize`)
  setStatusBarColorAndroid()
  updateAppInfo()
  registerAppUrl()
  registerTrackingPermission()
}

if (isApp()) {
  // initialize in module scope
  initialize()
}
