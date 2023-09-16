'use client'
import React from 'react'
import { useAsyncEffect } from '@hooks/use-async-effect'
import { ImageEditPipeline } from '@model/image/image-edit-pipeline'
import { Tuple } from '@model/image/image-edit-pipeline/types'
import { ImageEditSourceCanvas } from '@model/image/image-edit-pipeline/image-edit-canvas/source'
import { useRenderElementAsChild } from '@hooks/use-render-element-as-child'
import { useGesture } from '@use-gesture/react'
import { useStateRef } from '@hooks/use-state-ref'

import styles from './style.module.scss'

interface PinchData {
  lastda: Tuple
  firstda: Tuple
  rotateStartDA: Tuple | null
}

/*
    receives an imageEditPipeline.
    provides an overlay that renders the base image and alters the pipeline from user inputs.
*/

export const PipelineImageEditor = ({
  pipeline,
  className,
}: {
  pipeline: ImageEditPipeline
  className?: string
}) => {
  const rootRef = useStateRef<HTMLDivElement>()
  const [imageEditSourceCanvas, setImageEditSourceCanvas] =
    React.useState<ImageEditSourceCanvas | null>(null)

  // eslint-disable-next-line
  useAsyncEffect(async () => {
    const imageEditSourceCanvas = await ImageEditSourceCanvas.create(pipeline)
    setImageEditSourceCanvas(imageEditSourceCanvas)
    return async () => {
      imageEditSourceCanvas.markReleased()
      setImageEditSourceCanvas(null)
    }
  }, [pipeline])

  useRenderElementAsChild(
    rootRef.current,
    imageEditSourceCanvas?.element || null,
  )

  const pinchData = React.useRef<PinchData>({
    lastda: [0, 0],
    firstda: [0, 0],
    rotateStartDA: null,
  })

  useGesture(
    {
      // TODO onDrag is not appropriate. it gets canceled in many situations.
      onDrag: ({ delta: [x, y] }) => {
        if (!rootRef.current) return
        if (!imageEditSourceCanvas) return
        const prevTransform = pipeline.transform
        const {
          translate: [prevX, prevY],
        } = prevTransform

        const { width: frameWidth, height: frameHeight } =
          rootRef.current.getBoundingClientRect()
        const xDiff = x / frameWidth
        const yDiff = y / frameHeight

        console.log(`x: ${x} y: ${y}`)

        pipeline.setTransform({
          ...prevTransform,
          translate: [prevX + xDiff, prevY + yDiff],
        })
      },
      onPinch: ({ first, da: [d, a] }) => {
        if (!rootRef.current) return
        if (!imageEditSourceCanvas) return

        if (!first) {
          const prevTransform = pipeline.transform
          const { scale: prevScale, rotate: prevRotate } = prevTransform

          const [lastD, lastA] = pinchData.current.lastda
          const deltaD = d - lastD
          let rotate = prevRotate

          if (!pinchData.current.rotateStartDA) {
            const [, firstA] = pinchData.current.firstda
            const deltaA = ((a - firstA + 720 + 180) % 360) - 180
            if (deltaA >= 15 || deltaA <= -15) {
              // start rotating!
              pinchData.current.rotateStartDA = [d, a]
            }
          } else {
            const deltaA = ((a - lastA + 720 + 180) % 360) - 180
            rotate += deltaA
          }

          pipeline.setTransform({
            ...prevTransform,
            rotate,
            scale: prevScale + deltaD * 0.01 * 0.5,
          })

          // TODO pinch zoom should translate to the pinch center!!!!!! need to use the origin
        } else {
          pinchData.current.firstda = [d, a]
          pinchData.current.rotateStartDA = null
        }
        pinchData.current.lastda = [d, a]
      },
    },
    {
      target: rootRef,
    },
  )

  return (
    <div
      className={`${styles.rootContainer} ${className || ``}`}
      ref={rootRef}
    />
  )
}
