import { isApp } from '@framework/app'
import {
  initialize as initializeWeb,
  get as getWeb,
  set as setWeb,
  del as delWeb,
} from './web'
import { get as getApp, set as setApp, del as delApp } from './app'

let initialized = false

/*
    TODO : check for initialize race conditiions 
*/
export const initialize = async () => {
  console.log(`@preferences:initialize`)

  if (isApp()) {
    // no-op
  } else {
    await initializeWeb()
  }

  initialized = true
}

export const get = async (key: string): Promise<string | null> => {
  if (!initialized) {
    await initialize()
  }

  if (isApp()) {
    return getApp(key)
  } else {
    return getWeb(key)
  }
}

export const set = async (key: string, value: string) => {
  if (!initialized) {
    await initialize()
  }

  if (isApp()) {
    return setApp(key, value)
  } else {
    return setWeb(key, value)
  }
}

export const del = async (key: string) => {
  if (!initialized) {
    await initialize()
  }

  if (isApp()) {
    return delApp(key)
  } else {
    return delWeb(key)
  }
}
