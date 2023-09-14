import bcrypt from 'bcrypt'
import { compactDecrypt } from 'jose'
import {
  getAuthKeyObjectSymmetric256,
  getAuthKeyStringSymmetric256,
} from '#framework/auth/key'
import jwt from 'jsonwebtoken'

export const getTestVerificationCode = async () => {
  // MUST_IMPLEMENT
  // read database
  if (process.env.NODE_ENV !== `development`) {
    throw new Error(`not implemented`)
  }

  return `TEST_VERIFICATION_CODE`
}

export const createPasswordHash = async (password: string) => {
  const saltRounds = 10
  const pwhash = await bcrypt.hash(password, saltRounds)
  return pwhash
}

export const decodeAuthKeySignedToken = async <PayloadType>(token: string) => {
  const { plaintext: decryptedTokenBuffer /*, protectedHeader */ } =
    await compactDecrypt(token, getAuthKeyObjectSymmetric256())

  const decryptedToken = new TextDecoder().decode(decryptedTokenBuffer)

  // throws error if time expire
  return jwt.verify(
    decryptedToken,
    getAuthKeyStringSymmetric256(),
  ) as PayloadType
}
