import 'dotenv'

/*
    VAPID KEY!

    const webpush = require('web-push');

    // VAPID keys should be generated only once.
    const {
        publicKey, // store to VAPID_KEY_PUBLIC
        privateKey // store to VAPID_KEY_PRIVATE
    } = webpush.generateVAPIDKeys();

    store to 

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
