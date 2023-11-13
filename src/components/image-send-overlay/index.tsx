'use client'
import React from 'react'
import styles from './style.module.scss'
import { ImageEditPipeline } from '@/src/framework/image/image-edit-pipeline'
import { PipelineImageEditor } from '@containers/pipeline-image-editor'
import { Spinner } from '@/src/components/spinner'

export const ImageSendOverlay = ({
  imageEditPipeline,
  submit,
  close,
  isLoading,
}: {
  imageEditPipeline: ImageEditPipeline
  submit: () => void
  close: () => void
  isLoading?: boolean
}) => {
  React.useEffect(() => {
    document.body.classList.add(`disable-scroll`)
    return () => {
      document.body.classList.remove(`disable-scroll`)
    }
  }, [])

  return (
    <div className={styles.rootContainer}>
      <div className={styles.innerBoundary}>
        <div className={styles.topRow}>
          <button
            type="button"
            onClick={() => {
              close()
            }}
            className={`${styles.closeButton} t14`}
          >
            취소
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isLoading) {
                submit()
              }
            }}
            className={`${styles.sendButton} t14`}
          >
            {isLoading ? <Spinner color="white" size={6} /> : `전송`}
          </button>
        </div>

        <PipelineImageEditor
          pipeline={imageEditPipeline}
          className={styles.editor}
        />
      </div>
    </div>
  )
}
