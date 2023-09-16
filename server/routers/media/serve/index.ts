import { asyncHandler } from '#framework/express'
import { Router } from 'express'
import { ResError } from '#util/error'
import { decodeSignedFilePath } from '@/server/framework/file/util'
import { readDirectly } from '#framework/database/read'
import { FileDocument } from '#framework/file/types'
import {
  PUBLIC_CACHE_DURATION_SECONDS,
  PRIVATE_CACHE_DURATION_SECONDS,
} from '#framework/file/config'
import { handleImageServe } from '#framework/media/image/handler'
import path from 'path'

const mediaServeRouter = Router()

/*
  /m/ASDFASDFASDF?w=360&a=accessLevel|iat|hash
  

  sha256 hash : a4m6HQzFozPc7uYyCzP8yVg7jJCRzQz4OGM3r0Ipk+/=
                a4m6HQzFozPc7uYyCzP8yVg7jJCRzQz4OGM3r0Ipk-_ (known padding)
  time : Ofo4aTz https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
  
  accessLabel : chatroom%3AADSFASDFASDFASDFASDF (encodeURIComponent)
                 1            -2    -1
  /m/ASDFASDFASDF.<accessLabel>.<iat>.<sha256>
                  decode,       number, replace + pad
  
  /m/FILEFILEFILE.cr-ADSADASDFSF.Ofo4aTz.a4m6HQzFozPc7uYyCzP8yVg7jJCRzQz4OGM3r0Ipk-_
  

  on object request : 
    read object
    check auth
    return object & accessLabel signature (need a better way)
    // label & issued at floored to nearest hours / days / etc to utilize cdn caching.
    // cacheWindow : nearest 10000 (2.77 hour), 100000 (1.15 day) sec, etc.
    // makes private file resources share cached cdn.
    // sessionDuration : 3600

    // want to increase cacheWindow for longer access labels, right?


  on file request : 
    read fileDocument
    1. check accessLabels and compare with the signed url query
    2. get metdata (type, subtype, cacheDuration)
    3. check if processed file exists
    4. if not exists, process
    5. return the file.
    - cache header : set cache duration : cacheWindow + sessionDuration
    - signedUrlDuration : cacheWindow + sessionDuration

  It'll be served via cdn anyways. no need to suffer reading from database
*/

// /m/p/file-name.png
const handleFileServe = (fileDocument: FileDocument) =>
  asyncHandler(async (req, res, next) => {
    // handle!

    const acceptHeader: string = req.get(`Accept`) || ``
    const { type, mimetype } = fileDocument

    if (!req.accepts(mimetype)) {
      throw new ResError(406, `no acceptable type for ${acceptHeader}`)
    }

    switch (type) {
      case 'image':
        return handleImageServe(fileDocument)(req, res, next)
      default:
        throw new ResError(
          501,
          `file handler for type : ${type} not implemented.`,
        )
    }
  })

// p for public
mediaServeRouter.get(
  // might or might not be uriEncoded
  `/p/:filePath`,
  asyncHandler(async (req, res, next) => {
    const _filePath: string = req.params.filePath
    if (!_filePath) {
      throw new ResError(400, `filePath not provided!`)
    }
    const filePath = decodeURIComponent(_filePath)

    const fileDocument = await readDirectly<FileDocument>(
      path.join(`/files/`, filePath),
    )

    if (!fileDocument) {
      throw new ResError(400, `file ${filePath} not found!`)
    }

    if (fileDocument.accessLevel !== `public`) {
      throw new ResError(400, `The resource's accessLevel is not public`)
    }

    /*
      public
      max-age={PUBLIC_CACHE_DURATION_SECONDS} client cache duration
      immutable : clients cache it
    */

    res.set(
      `Cache-Control`,
      `public, max-age=${PUBLIC_CACHE_DURATION_SECONDS}, immutable`,
    )

    return handleFileServe(fileDocument)(req, res, next)
  }),
)

// s for signed
mediaServeRouter.get(
  // must accept signed path format
  `/s/:signedFilePath`,
  asyncHandler(async (req, res, next) => {
    const signedFilePath: string = req.params.signedFilePath
    if (!signedFilePath) {
      throw new ResError(400, `signedFilePath not provided!`)
    }

    const { filePath, accessLabel, cacheBlockBaseSeconds } =
      decodeSignedFilePath(signedFilePath)

    /*
      1. compare iatSeconds
      2. read file and check accessLabel
      3. handle!
    */

    const fileDocument = await readDirectly<FileDocument>(
      path.join(`/files/`, filePath),
    )

    if (!fileDocument) {
      throw new ResError(400, `file ${filePath} not found!`)
    }

    if (fileDocument.accessLevel !== `private`) {
      throw new ResError(400, `The resource's accessLevel is not private`)
    }

    if (!fileDocument.privateAccessLabels.includes(accessLabel)) {
      throw new ResError(403, `Permission denied; Invalid access label`)
    }

    const currentTimeSeconds = Math.floor(Date.now() / 1000)

    if (
      cacheBlockBaseSeconds + PRIVATE_CACHE_DURATION_SECONDS <
      currentTimeSeconds
    ) {
      throw new ResError(400, `Url expired`)
    }

    /*
      public
      max-age={PUBLIC_CACHE_DURATION_SECONDS} client cache duration
      s-maxage={PRIVATE_CACHE_DURATION_SECONDS} cdn cache duration
      proxy-revalidate : cdn should not serve stale
      immutable : clients cache it
    */

    res.set(
      `Cache-Control`,
      `public, max-age=${PUBLIC_CACHE_DURATION_SECONDS}, s-maxage=${PRIVATE_CACHE_DURATION_SECONDS}, proxy-revalidate, immutable`,
    )

    return handleFileServe(fileDocument)(req, res, next)
  }),
)

export { mediaServeRouter }
