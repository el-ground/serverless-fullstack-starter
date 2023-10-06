import { isApp } from '@framework/app'
import {
  initialize as initializeWeb,
  get as getWeb,
  set as setWeb,
  del as delWeb,
} from './web'

let initialized = false

/*
    TODO : check for initialize race conditiions 
*/
export const initialize = async () => {
  console.log(`@preferences:initialize`)

  if (isApp()) {
    throw new Error(`Not implemented!`)
  }

  await initializeWeb()

  initialized = true
}

export const get = async (key: string): Promise<string | null> => {
  if (!initialized) {
    await initialize()
  }

  if (isApp()) {
    throw new Error(`Not implemented!`)
  }

  return getWeb(key)
}

export const set = async (key: string, value: string) => {
  if (!initialized) {
    await initialize()
  }

  if (isApp()) {
    throw new Error(`Not implemented!`)
  }

  return setWeb(key, value)
}

export const del = async (key: string) => {
  if (!initialized) {
    await initialize()
  }

  if (isApp()) {
    throw new Error(`Not implemented!`)
  }

  return delWeb(key)
}
