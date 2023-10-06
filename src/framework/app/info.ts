import React from 'react'
import { Capacitor } from '@capacitor/core'
import { App, AppInfo } from '@capacitor/app'
import { isApp } from './'
import { useAsyncEffect } from '@hooks/use-async-effect'

// any versions under the base version will prompted to update!
// TODO : upgrade : 1.2.0
export const androidUpdateBaseVersion = `1.1.1`
// TODO : upgrade
export const iosUpdateBaseVersion = `1.1.0`

let appInfo: AppInfo | null = null

export const updateAppInfo = async () => {
  if (Capacitor.isNativePlatform()) {
    const result = await App.getInfo()
    appInfo = result
    return result
  }

  return null
}

if (isApp()) {
  // load appInfo!
  updateAppInfo()
}

export const getVersion = async () => {
  if (!appInfo) {
    await updateAppInfo()
  }

  return appInfo?.version || null
}

export const useAppInfo = () => {
  const [appInfoState, setAppInfoState] = React.useState<AppInfo | null>(
    appInfo,
  )
  // eslint-disable-next-line
  useAsyncEffect(async () => {
    if (!appInfo) {
      const result = await updateAppInfo()
      setAppInfoState(result)
    }
  }, [])
  return appInfoState
}

// checks if targetVersion is satisfied by our baseVersion
export const compareVersion = (
  installedVersion: string,
  targetVersion: string,
) => {
  try {
    const [baseMajor, baseMinor, baseFix] = targetVersion
      .split(`.`)
      .map((e) => Number(e))
    const [installedMajor, installedMinor, installedFix] = installedVersion
      .split(`.`)
      .map((e) => Number(e))

    if (installedMajor > baseMajor) {
      // pass
      return true
    }

    if (installedMajor === baseMajor) {
      if (installedMinor > baseMinor) {
        // pass
        return true
      }

      if (installedMinor === baseMinor) {
        if (installedFix >= baseFix) {
          // pass
          return true
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  return false
}

export const checkIfVersionSatisfied = async (targetVersion: string) => {
  const version = await getVersion()

  if (!version) {
    // no version, no satisfied!
    return false
  }

  return compareVersion(version, targetVersion)
}

export const checkIfVersionSatisfiedSync = (targetVersion: string) => {
  const version = appInfo?.version || null

  if (!version) {
    // no version, no satisfied!
    return false
  }

  return compareVersion(version, targetVersion)
}
