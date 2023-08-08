import crypto from 'node:crypto'
import 'dotenv'

/*
  generating RSA key :
  1. create private key (AUTH_KEY_RSA_4096_PRIVATE)
  ssh-keygen -t rsa -P "" -b 4096 -m PEM -f AUTH_KEY_RSA_4096.key

  2. create public key from private key
  ssh-keygen -e -m PEM -f jwtRS256.key > AUTH_KEY_RSA_4096.pub

  3. create PEM public key (AUTH_KEY_RSA_4096_PUBLIC)
  ssh-keygen -f AUTH_KEY_RSA_4096.pub -e -m pem > AUTH_KEY_RSA_4096.pub.pem

  generating symmetric key (AUTH_KEY_SYMMETRIC_256) 
  openssl rand -hex 32 > AUTH_KEY_SYMMETRIC_256.key

  read files and specify keys as environment values : 
  AUTH_KEY_RSA_4096_PRIVATE
  AUTH_KEY_RSA_4096_PUBLIC
  AUTH_KEY_SYMMETRIC_256
  
*/

export const getAuthKeyStringRSA4096Private = () => {
  const key = process.env.AUTH_KEY_RSA_4096_PRIVATE
  if (!key) {
    throw new Error(`AUTH_KEY_RSA_4096_PRIVATE not provided!`)
  }

  return key
}

export const getAuthKeyStringRSA4096Public = () => {
  const key = process.env.AUTH_KEY_RSA_4096_PUBLIC
  if (!key) {
    throw new Error(`AUTH_KEY_RSA_4096_PUBLIC not provided!`)
  }
  return key
}

export const getAuthKeyObjectSymmetric256 = () => {
  const key = process.env.AUTH_KEY_SYMMETRIC_256
  if (!key) {
    throw new Error(`AUTH_KEY_SYMMETRIC_256 not provided!`)
  }
  return crypto.createSecretKey(key, `hex`)
}
