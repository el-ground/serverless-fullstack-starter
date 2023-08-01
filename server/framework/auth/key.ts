import crypto from 'node:crypto'

/*
  ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwtRS256.key -> private key
  ssh-keygen -e -m PEM -f jwtRS256.key > jwtRS256.key.pub -> public key
*/

export const getAuthKey = () => {
  const authKey = process.env.AUTH_KEY

  if (!authKey) {
    throw new Error(`AUTH_KEY not provided!`)
  }
  return authKey // used for jsonwebotken library
}
export const getAuthKeyObject = () => {
  const authKey = getAuthKey()
  return crypto.createPrivateKey(authKey) // used for jose library
}

export const getAuthPublicKey = async () => {
  // can load from external store, or load from environment variable.
  const authPublicKey = process.env.AUTH_KEY_PUB

  if (!authPublicKey) {
    throw new Error(`AUTH_KEY_PUB not provided!`)
  }

  return authPublicKey
}
