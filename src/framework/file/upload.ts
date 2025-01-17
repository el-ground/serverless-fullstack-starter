import { toast } from 'react-toastify'

export interface FileUploadParameter {
  blob: Blob
  mimetype: string // mimetype : image/jpeg or so.
}

export const uploadFiles = async ({
  fileUploadParameters,
  accessLevel,
  privateAccessLabels = [],
  skipMessage = true,
}: {
  fileUploadParameters: FileUploadParameter[]
  accessLevel: `private` | `public`
  privateAccessLabels?: string[]
  skipMessage?: boolean
}) => {
  const uploadingFilesToastId = skipMessage
    ? -1
    : toast.info(
        `${fileUploadParameters.length}개 파일을 업로드하고 있습니다.`,
        {
          autoClose: false,
          position: toast.POSITION.BOTTOM_CENTER,
        },
      )

  const formData = new FormData()
  fileUploadParameters.forEach(({ blob, mimetype }) => {
    // https://stackoverflow.com/a/50875615
    const blobWithType = new Blob([blob], { type: mimetype })
    formData.append(`files[]`, blobWithType)
  })

  let resultPaths: string[]
  try {
    const fetchResult = await fetch(
      `/api/rest/files?accessLevel=${accessLevel}&privateAccessLabels=${privateAccessLabels.join(
        `,`,
      )}`,
      {
        method: `POST`,
        credentials: `include`, // send cookies
        body: formData,
      },
    )

    resultPaths = (await fetchResult.json()) as string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!skipMessage) {
      toast.update(uploadingFilesToastId, {
        render: `파일 업로드 중 에러가 발생했습니다.\n${e?.message}`,
        type: toast.TYPE.ERROR,
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
      })
    }
    throw e
  }

  if (!skipMessage) {
    toast.update(uploadingFilesToastId, {
      render: `${resultPaths.length}개 파일 업로드 성공.`,
      type: toast.TYPE.SUCCESS,
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
    })
  }
  return resultPaths
}
