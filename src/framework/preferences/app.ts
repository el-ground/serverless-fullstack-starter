import { Preferences } from '@capacitor/preferences'

export const set = async (key: string, value: string) => {
  return Preferences.set({
    key,
    value,
  })
}

export const get = async (key: string) => {
  const result = await Preferences.get({
    key,
  })
  return result.value
}

export const del = async (key: string) => {
  return Preferences.remove({
    key,
  })
}
