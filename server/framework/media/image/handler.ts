import { Readable } from 'stream'
import { streamToPromise } from '#util/stream-to-promise/index.js'
import sharp from 'sharp'
import { FileDocument } from '#framework/file/types'
import {
  getExists,
  createReadStream,
  createWriteStream,
} from '#framework/file/service'
import { asyncHandler } from '#framework/express'
import { ResError } from '#util/error'

export type SupportedImageFormat = `webp` | `jpeg`

export const getProcessedFilePath = (
  path: string,
  format: SupportedImageFormat,
  width: number,
) => {
  return `${path}?width=${width}.${format}`
}

export const processAndReturnStream = async (
  fileDocument: FileDocument,
  format: SupportedImageFormat,
  width: number,
): Promise<Readable> => {
  const processedFilePath = getProcessedFilePath(
    fileDocument.path,
    format,
    width,
  )
  const exists = await getExists(processedFilePath)

  if (!exists) {
    // if not exists, create!!
    const transform = sharp()
    transform.resize(width, undefined)
    transform.toFormat(format, { force: true })
    const baseFileReadStream = createReadStream(fileDocument.path)
    const processedFileWriteStream = createWriteStream(processedFilePath, {
      userId: fileDocument.userId,
      contentType: `image/${format}`,
    })
    await streamToPromise(
      baseFileReadStream.pipe(transform).pipe(processedFileWriteStream),
    )
  }

  return createReadStream(processedFilePath)
}

export const handleImageServe = (fileDocument: FileDocument) =>
  asyncHandler(async (req, res) => {
    const acceptHeader: string = req.get(`Accept`) || ``
    const { query } = req

    const webpAccepted = !!(acceptHeader.indexOf(`image/webp`) !== -1)

    const format = webpAccepted ? `webp` : `jpeg`
    const width = Number(query.width || query.w)

    if (Number.isNaN(width)) {
      throw new ResError(400, `Invalid width`)
    }

    const readStream = await processAndReturnStream(fileDocument, format, width)

    res.set(`Content-Type`, `image/${format}`).set(`Vary`, `Accept`)
    res.status(200)

    readStream.pipe(res)
  })
