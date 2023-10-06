import {
  AppTrackingTransparency,
  AppTrackingStatus,
} from 'capacitor-plugin-app-tracking-transparency'
import { Capacitor } from '@capacitor/core'
import { isApp } from '.'

let appTrackingStatus: AppTrackingStatus | null = null
// TODO read from appTrackingStatus before sending tracking data. (opt in for ios)
/*
    TODO Needs to get smarter about request timing!! 
  */
/*
      Checks status, if can request permission, request permission.
      TrackingPermissions is about data not leaving the device;
  */
export const registerTrackingPermission = async () => {
  //
  if (isApp()) {
    if (Capacitor.getPlatform() === `ios`) {
      const response = await AppTrackingTransparency.getStatus()
      appTrackingStatus = response.status
      if (appTrackingStatus === `notDetermined`) {
        const response = await AppTrackingTransparency.requestPermission()
        appTrackingStatus = response.status
      }
    } else if (Capacitor.getPlatform() === `android`) {
      appTrackingStatus = `authorized` // android authorized for default!
    }
  }
}
