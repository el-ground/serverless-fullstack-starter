import '#util/env'

/*
    VAPID KEY!

    npx web-push generate-valid-keys
*/

export const getVapidKeyPrivate = () => {
  const key = process.env.VAPID_KEY_PRIVATE
  if (!key) {
    throw new Error(`VAPID_KEY_PRIVATE not provided!`)
  }

  return key
}

export const getVapidKeyPublic = () => {
  const key = process.env.VAPID_KEY_PUBLIC
  if (!key) {
    throw new Error(`VAPID_KEY_PUBLIC not provided!`)
  }
  return key
}
