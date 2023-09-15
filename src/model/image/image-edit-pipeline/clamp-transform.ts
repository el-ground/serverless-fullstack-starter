import { Tuple, AspectRatio, Transform } from './types'
import clamp from 'clamp'
import {
  getRotateInscribeDimension,
  getRotateCircumDimension,
  rotateCounterclockwise,
} from './util'

/*
    fits boundary
  */
export const clampTransform = (
  [originalWidth, originalHeight]: Tuple, // target canvas' dimension
  baseAspectRatio: AspectRatio, // pipeline's aspectRatio
  transform: Transform,
): Transform => {
  const {
    scale: inputScale,
    translate: [inputTranslateX, inputTranslateY],
    rotate,
    ...rest
  } = transform

  const counterClockwiseRotate = -rotate

  // since the scale is set, set the transform boundary.
  // scale comes first because translate boundary depends on scale

  const [maxInnerWidth, maxInnerHeight] = getRotateInscribeDimension(
    [originalWidth, originalHeight],
    counterClockwiseRotate,
    baseAspectRatio,
  )

  const widthScale = originalWidth / maxInnerWidth
  const heightScale = originalHeight / maxInnerHeight
  const scaleNeededFromRotation = Math.min(widthScale, heightScale)

  const scale = clamp(inputScale, scaleNeededFromRotation, 4)

  const windowWidth = (maxInnerWidth / scale) * scaleNeededFromRotation
  const windowHeight = (maxInnerHeight / scale) * scaleNeededFromRotation

  const [rotatedCircumWindowWidth, rotatedCircumWindowHeight] =
    getRotateCircumDimension(
      [windowWidth, windowHeight],
      counterClockwiseRotate,
    )

  const rotatedCircumWindowWidthIncreaseAmount =
    originalWidth - rotatedCircumWindowWidth
  const rotatedCircumWindowHeightIncreaseAmount =
    originalHeight - rotatedCircumWindowHeight
  const rotatedCircumWindowTranslateXMax =
    rotatedCircumWindowWidthIncreaseAmount / (2 * windowWidth)
  const rotatedCircumWindowTranslateYMax =
    rotatedCircumWindowHeightIncreaseAmount / (2 * windowHeight)
  const [rotatedInputTranslateX, rotatedInputTranslateY] =
    rotateCounterclockwise(
      [inputTranslateX, inputTranslateY],
      counterClockwiseRotate, //
    )

  const rotatedTranslateX = clamp(
    rotatedInputTranslateX,
    -rotatedCircumWindowTranslateXMax,
    rotatedCircumWindowTranslateXMax,
  )
  const rotatedTranslateY = clamp(
    rotatedInputTranslateY,
    -rotatedCircumWindowTranslateYMax,
    rotatedCircumWindowTranslateYMax,
  )
  const [translateX, translateY] = rotateCounterclockwise(
    [rotatedTranslateX, rotatedTranslateY],
    -counterClockwiseRotate,
  )

  return {
    scale,
    translate: [translateX, translateY],
    rotate,
    ...rest,
  }
}
