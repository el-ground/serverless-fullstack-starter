import multer from 'multer'
import { create as createUUID } from '#util/uuid'
import { logInfo } from '#util/log'
import type { Request } from 'express'
import { ResError } from '#util/error'
import { FileMetadata } from './types'
import { createWriteStream } from './service'
import contentTypeParser from 'content-type-parser'

// https://github.com/arozar/multer-google-storage/blob/master/src/index.ts

export class MulterStorageEngine implements multer.StorageEngine {
  _handleFile(
    req: Request,
    file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    /*
      create a random name file, return the path.
    */

    const {
      auth: { userId, isAuthenticated },
    } = req

    if (!isAuthenticated || !userId) {
      throw new ResError(403, `Permission denied`)
    }

    /*
      need to set mimetype to blob when uploading.
      https://stackoverflow.com/a/50875615 
    */
    const contentType = file.mimetype

    const parsedContentType = contentTypeParser(contentType)
    if (!parsedContentType) {
      throw new ResError(400, `Invalid content type : ${contentType}`)
    }

    if (!parsedContentType.type) {
      throw new ResError(500, `Failed to parse type`)
    }

    const extension = parsedContentType.subtype as string
    if (!extension) {
      throw new ResError(500, `Failed to parse extension`)
    }

    const fileId = createUUID(20)

    // createWriteStream

    const filePath = `/${userId}/${fileId}.${extension}`

    const metadata: FileMetadata = {
      userId,
      contentType,
    }

    logInfo(`filePath : ${filePath}`)

    const writeStream = createWriteStream(filePath, metadata)

    file.stream.pipe(writeStream)

    writeStream.on('error', cb)
    writeStream.on('finish', function () {
      cb(null, {
        path: filePath,
      })
    })
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    cb(new ResError(400, `Remove file not implemented!`))
  }
}

// random Id => return
