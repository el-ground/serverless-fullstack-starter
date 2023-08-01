import bcrypt from 'bcrypt'

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
