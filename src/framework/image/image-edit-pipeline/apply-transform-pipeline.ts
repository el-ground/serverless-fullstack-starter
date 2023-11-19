import { AspectRatio, Transform } from './types'
import { getPica, resizeOptions } from './pica'
import { taskRunner } from './task-runner'
import {
  createCanvasElement,
  getRotateInscribeDimension,
  getRotateCircumDimension,
  rotateCounterclockwise,
  getContextFromCanvasElement,
  releaseCanvasElement,
  DEG2RAD,
} from './util'

export const applyTransformPipeline = (
  ...args: Parameters<typeof _applyTransformPipeline>
) => taskRunner.run(() => _applyTransformPipeline(...args))

/*
    applies transform and render to the target canvas
  */
export const _applyTransformPipeline = async (
  inputCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement, // dimensions took from the outputCanvas
  transform: Transform,
  baseAspectRatio: AspectRatio,
) => {
  const croppedCanvas = createCanvasElement()
  const rotatedScaledCanvas = createCanvasElement()

  const {
    scale,
    translate: [inputTranslateX, inputTranslateY],
    rotate,
  } = transform

  const counterClockwiseRotate = -rotate

  const { width: originalWidth, height: originalHeight } = inputCanvas

  const [maxInnerWidth, maxInnerHeight] = getRotateInscribeDimension(
    [originalWidth, originalHeight],
    counterClockwiseRotate,
    baseAspectRatio,
  )

  const widthScale = originalWidth / maxInnerWidth
  const heightScale = originalHeight / maxInnerHeight
  const scaleNeededFromRotation = Math.min(widthScale, heightScale)

  const windowWidth = (maxInnerWidth / scale) * scaleNeededFromRotation
  const windowHeight = (maxInnerHeight / scale) * scaleNeededFromRotation

  const [rotatedCircumWindowWidth, rotatedCircumWindowHeight] =
    getRotateCircumDimension(
      [windowWidth, windowHeight],
      counterClockwiseRotate,
    )
  const [rotatedInputTranslateX, rotatedInputTranslateY] =
    rotateCounterclockwise(
      [inputTranslateX, inputTranslateY],
      counterClockwiseRotate, //
    )

  const rotatedWindowWidthIncreaseAmount =
    originalWidth - rotatedCircumWindowWidth
  const rotatedWindowHeightIncreaseAmount =
    originalHeight - rotatedCircumWindowHeight

  const rotatedWindowStartX =
    windowWidth * -rotatedInputTranslateX + rotatedWindowWidthIncreaseAmount / 2
  const rotatedWindowStartY =
    windowWidth * -rotatedInputTranslateY +
    rotatedWindowHeightIncreaseAmount / 2

  croppedCanvas.width = rotatedCircumWindowWidth
  croppedCanvas.height = rotatedCircumWindowHeight

  /*
        console.log({
          widthScale,
          heightScale,
          scaleNeededFromRotation,
          windowWidth,
          windowHeight,
          rotatedWindowStartX,
          rotatedWindowStartY,
          rotatedCircumWindowWidth,
          rotatedCircumWindowHeight,
        })
        */
  const ctx = getContextFromCanvasElement(croppedCanvas)
  // rotate is based on the top left corner, so we translate before and after rotation to rotate by the center of the image.
  ctx.translate(rotatedCircumWindowWidth / 2, rotatedCircumWindowHeight / 2)
  ctx.rotate(rotate * DEG2RAD)

  ctx.translate(-rotatedCircumWindowWidth / 2, -rotatedCircumWindowHeight / 2)

  // crop to fit the actual window width

  ctx.drawImage(
    inputCanvas,
    rotatedWindowStartX,
    rotatedWindowStartY,
    rotatedCircumWindowWidth,
    rotatedCircumWindowHeight,
    0,
    0,
    rotatedCircumWindowWidth,
    rotatedCircumWindowHeight,
  )

  /*
        console.log(
          `rotatedCircumWindowWidth : ${rotatedCircumWindowWidth}, windowWidth : ${windowWidth}`,
        )
        console.log(
          `rotatedCircumWindowHeight : ${rotatedCircumWindowHeight}, windowHeight : ${windowHeight}`,
        )
        */

  const width = Math.floor(windowWidth)
  const height = Math.floor(windowHeight)
  rotatedScaledCanvas.width = width
  rotatedScaledCanvas.height = height

  /*
        console.log(`rotate : ${rotate}`)
        */
  const ctx2 = getContextFromCanvasElement(rotatedScaledCanvas)

  ctx2.drawImage(
    croppedCanvas,
    Math.floor((rotatedCircumWindowWidth - windowWidth) / 2),
    Math.floor((rotatedCircumWindowWidth - windowWidth) / 2), // hmm??
    width,
    height,
    0,
    0,
    width,
    height,
  )

  // release cropped
  releaseCanvasElement(croppedCanvas)
  await getPica().resize(rotatedScaledCanvas, outputCanvas, resizeOptions)
  releaseCanvasElement(rotatedScaledCanvas)
}
