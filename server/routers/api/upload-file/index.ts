import { asyncHandler } from '#framework/express'
import { Router } from 'express'
import multer from 'multer'
import { MulterStorageEngine } from '#framework/file/multer'
import { FileDocument, UserFileDirectoryDocument } from '#framework/file/types'
import { runTransaction } from '#framework/database/transaction'
import { createInTransaction } from '#framework/database/write/create'
import { ResError } from '#util/error'
import contentTypeParser from 'content-type-parser'
import { readInTransaction } from '#framework/database/read'
import { create as createUUID } from '#util/uuid'
import { updateInTransaction } from '@/server/framework/database/write/update'

const fileUploadRouter = Router()

const uploadHandler = multer({
  storage: new MulterStorageEngine(),
})

/*
    files.
*/
fileUploadRouter.post(
  `/files`,
  [uploadHandler.any()],
  asyncHandler(async (req, res) => {
    // after file written to storage,
    // create fileDocuments and userFileDirectoryDocument
    const {
      auth: { userId, isAuthenticated },
      files,
      query: {
        accessLevel: _accessLevel,
        privateAccessLabels: _privateAccessLabels,
      },
    } = req

    if (!isAuthenticated || !userId) {
      throw new ResError(403, `Permission denied`)
    }

    if (typeof _accessLevel !== `string` || !_accessLevel) {
      throw new ResError(400, `Must provide accessLevel`)
    }

    if (![`private`, `public`].includes(_accessLevel)) {
      throw new ResError(400, `Invalid accessLevel ${_accessLevel}`)
    }

    const accessLevel = _accessLevel as `public` | `private`

    let privateAccessLabels: string[] = []
    if (_privateAccessLabels) {
      if (typeof _privateAccessLabels !== `string`) {
        throw new ResError(
          400,
          `Invalid privateAccessLabels ${_privateAccessLabels}`,
        )
      }

      privateAccessLabels = _privateAccessLabels
        .split(`,`)
        .map((e) => e.trim())
        .flatMap((e) => (e ? [e] : []))
    }

    if (!files || !Array.isArray(files) || files?.length === 0) {
      throw new ResError(400, `files is not defined or length is zero!`)
    }

    let fileDocumentIds: string[] = []
    await runTransaction(async (transaction) => {
      const prevUserFileDirectoryDocument =
        await readInTransaction<UserFileDirectoryDocument>(
          `/user-file-directories/${userId}`,
          transaction,
        )

      const currentTimeSeconds = Math.floor(Date.now() / 1000)
      let currentUploadTotalCount = 0
      let currentUploadTotalSize = 0
      const currentUploadTypeCounts: Record<string, number> = {}
      const currentUploadTypeSizes: Record<string, number> = {}

      fileDocumentIds = []
      files.forEach(({ path, size, mimetype }) => {
        const id = createUUID(12)
        fileDocumentIds.push(id)

        if (!path) {
          throw new ResError(500, `path not provided!`)
        }

        if (!size) {
          throw new ResError(500, `size not provided!`)
        }

        if (!mimetype) {
          throw new ResError(500, `mimetype not provided!`)
        }

        const parsedContentType = contentTypeParser(mimetype)
        if (!parsedContentType) {
          throw new ResError(500, `Invalid mimetype : ${mimetype}`)
        }

        const { type, subtype } = parsedContentType
        if (!type) {
          throw new ResError(500, `type not provided!`)
        }
        if (!subtype) {
          throw new ResError(500, `subtype not provided!`)
        }

        currentUploadTotalCount += 1
        currentUploadTotalSize += size
        if (type in currentUploadTypeCounts) {
          currentUploadTypeCounts[type] += 1
        } else {
          currentUploadTypeCounts[type] = 1
        }

        if (type in currentUploadTypeSizes) {
          currentUploadTypeSizes[type] += size
        } else {
          currentUploadTypeSizes[type] = size
        }

        createInTransaction<FileDocument>(
          `/files/${id}`,
          {
            id,
            userId,
            createdAtSeconds: currentTimeSeconds,
            accessLevel,
            privateAccessLabels, // owners can always access the file.
            path,
            size,
            mimetype,
            type,
            subtype,
          },
          transaction,
        )
      })

      if (!prevUserFileDirectoryDocument) {
        createInTransaction<UserFileDirectoryDocument>(
          `/user-file-directories/${userId}`,
          {
            userId,
            createdAtSeconds: currentTimeSeconds,
            latestUpdatedAtSeconds: currentTimeSeconds,
            totalCount: currentUploadTotalCount,
            totalSize: currentUploadTotalSize,
            typeCounts: currentUploadTypeCounts,
            typeSizes: currentUploadTypeSizes,
          },
          transaction,
        )
      } else {
        // combine counts
        const {
          totalCount: prevTotalCount,
          totalSize: prevTotalSize,
          typeCounts: prevTypeCounts,
          typeSizes: prevTypeSizes,
        } = prevUserFileDirectoryDocument

        const combinedTypeCounts: Record<string, number> = {}
        const combinedTypeSizes: Record<string, number> = {}

        ;[
          ...Object.entries(currentUploadTypeCounts),
          ...Object.entries(prevTypeCounts),
        ].forEach(([k, v]) => {
          if (k in combinedTypeCounts) {
            combinedTypeCounts[k] += v
          } else {
            combinedTypeCounts[k] = v
          }
        })
        ;[
          ...Object.entries(currentUploadTypeSizes),
          ...Object.entries(prevTypeSizes),
        ].forEach(([k, v]) => {
          if (k in combinedTypeSizes) {
            combinedTypeSizes[k] += v
          } else {
            combinedTypeSizes[k] = v
          }
        })

        updateInTransaction<UserFileDirectoryDocument>(
          `/user-file-directories/${userId}`,
          {
            latestUpdatedAtSeconds: currentTimeSeconds,
            totalCount: prevTotalCount + currentUploadTotalCount,
            totalSize: prevTotalSize + currentUploadTotalSize,
            typeCounts: combinedTypeCounts,
            typeSizes: combinedTypeSizes,
          },
          transaction,
        )
      }
    })

    res.status(201)
    res.json(fileDocumentIds)
  }),
)

export { fileUploadRouter }
