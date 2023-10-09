import '#util/env'

/*
  generating RSA key :

  generating symmetric key (FILE_KEY_SYMMETRIC_256) 
  openssl rand -hex 32 > FILE_KEY_SYMMETRIC.key

  read files and specify keys as environment values : 
  FILE_KEY_SYMMETRIC_256
  
*/

export const getFileKeyStringSymmetric256 = () => {
  const key = process.env.FILE_KEY_SYMMETRIC_256
  if (!key) {
    throw new Error(`FILE_KEY_SYMMETRIC_256 not provided!`)
  }
  return key
}
