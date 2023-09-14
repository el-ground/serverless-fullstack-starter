import { Readable, Writable } from 'stream'
import { FileMetadata } from './types'

// write stream is synchronous :)
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

export const createReadStream = (filePath: string) => {
  // TODO : MUST_IMPLEMENT
  /*
    const bucket = storage.bucket()
    const fileRef = bucket.file(filePath)
    return fileRef.createReadStream()
  */

  return null as unknown as Readable
}

export const readMetadata = async (filePath: string): Promise<FileMetadata> => {
  // TODO : MUST_IMPLEMENT

  return null as unknown as FileMetadata
}

export const getExists = async (filePath: string) => {
  // TODO : MUST_IMPLEMENT
  return null as unknown as boolean
}
