'use client'
import React from 'react'
import { FileLike } from '@model/file'
import { ImageEditPipeline } from '@/src/model/image/image-edit-pipeline'
import { PipelineImagePreview } from '@/src/components/pipeline-image-preview'
import { PipelineImageEditor } from '../pipeline-image-editor'
import { useAsyncCallback } from '@hooks/use-async-callback'
import { uploadFiles } from '@model/file/upload'

/*
    choose file,
    show preview,
    edit image,
    upload.
*/

export const ExampleImageUploader = () => {
  const [editingPipeline, setEditingPipeline] =
    React.useState<ImageEditPipeline | null>(null)
  const [fileList, setFileList] = React.useState<FileLike[]>([])

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileLikeList: FileLike[] = []
      const { files: fileList } = event.target
      if (fileList) {
        for (let i = 0; i < fileList.length; i += 1) {
          fileLikeList.push(new FileLike(fileList[i]))
        }
      }
      setFileList(fileLikeList)
    },
    [],
  )

  const imageEditPipelineList = React.useMemo(() => {
    return fileList.map(
      (fileLike) => new ImageEditPipeline(fileLike, 1440, 4 / 3),
    )
  }, [fileList])

  const previewList = React.useMemo(() => {
    // click to open editor

    return imageEditPipelineList.map((pipeline) => (
      <div key={pipeline.source.key}>
        <PipelineImagePreview pipeline={pipeline} width={200} />
        <button
          type="button"
          onClick={() => {
            setEditingPipeline(pipeline)
          }}
        >
          Edit
        </button>
      </div>
    ))
  }, [imageEditPipelineList])

  // editor

  const editor = React.useMemo(() => {
    if (!editingPipeline) {
      return null
    }

    return (
      <div>
        <PipelineImageEditor pipeline={editingPipeline} />
        <button
          type="button"
          onClick={() => {
            setEditingPipeline(null)
          }}
        >
          CloseEdit
        </button>
      </div>
    )
  }, [editingPipeline])

  const upload = useAsyncCallback(async () => {
    const uploadParameters = await Promise.all(
      imageEditPipelineList.map((pipeline) => pipeline.exportImage(1440)),
    )

    const res = await uploadFiles(uploadParameters)

    console.log(res)
  }, [imageEditPipelineList])

  // uploadButton

  // great!

  return (
    <div>
      <label>
        <input onChange={onChange} type="file" accept="image/*" multiple />
        파일고르기
      </label>
      <div>{previewList}</div>
      {editor}
      <button type="button" onClick={upload}>
        파일업로드
      </button>
    </div>
  )
}
