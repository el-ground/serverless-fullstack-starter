import { Readable, Writable } from 'stream'
import { FileMetadata } from './types'

// write stream is synchronous :)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createWriteStream = (filePath: string, metadata: FileMetadata) => {
  // TODO : MUST_IMPLEMENT

  /*
  const bucket = storage.bucket()
  const fileRef = bucket.file(filePath)

  const writeStream = fileRef.createWriteStream({
    metadata: {
      contentType,
      metadata,
    },
    resumable: false,
    predefinedAcl: `private`,
  })
  */

  return null as unknown as Writable
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createReadStream = (filePath: string) => {
  // TODO : MUST_IMPLEMENT
  /*
    const bucket = storage.bucket()
    const fileRef = bucket.file(filePath)
    return fileRef.createReadStream()
  */

  return null as unknown as Readable
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const readMetadata = async (filePath: string): Promise<FileMetadata> => {
  // TODO : MUST_IMPLEMENT

  return null as unknown as FileMetadata
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getExists = async (filePath: string) => {
  // TODO : MUST_IMPLEMENT
  /*
    const processedFileRef = storage.bucket().file(processedFileName)
    let exists = (await processedFileRef.exists())[0]
  */
  return null as unknown as boolean
}
