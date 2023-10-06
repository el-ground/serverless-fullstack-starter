import React from 'react'
import { useAsyncEffect } from '@hooks/use-async-effect'
import { ImageEditPipeline } from '@framework/image/image-edit-pipeline'
import { useStateRef } from '@hooks/use-state-ref'
import { ImageEditPreviewCanvas } from '@framework/image/image-edit-pipeline/image-edit-canvas/preview'
import { useRenderElementAsChild } from '@hooks/use-render-element-as-child'

import styles from './style.module.scss'

export const PipelineImagePreview = ({
  pipeline,
  width,
  className,
}: {
  pipeline: ImageEditPipeline
  width: number
  className?: string
}) => {
  const rootRef = useStateRef<HTMLDivElement>()

  const [imageEditPreviewCanvas, setImageEditPreviewCanvas] =
    React.useState<ImageEditPreviewCanvas | null>(null)

  // eslint-disable-next-line
  useAsyncEffect(async () => {
    const imageEditPreviewCanvas = await ImageEditPreviewCanvas.create(
      pipeline,
      width,
    )
    setImageEditPreviewCanvas(imageEditPreviewCanvas)
    return async () => {
      imageEditPreviewCanvas.markReleased()
      setImageEditPreviewCanvas(null)
    }
  }, [pipeline, width])

  useRenderElementAsChild(
    rootRef.current,
    imageEditPreviewCanvas?.element || null,
  )

  return (
    <div
      className={`${styles.rootContainer} ${className || ``}`}
      ref={rootRef}
    />
  )
}
