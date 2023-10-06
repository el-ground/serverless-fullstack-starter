import { toast } from 'react-toastify'
import { Tuple, Degree, AspectRatio } from './types'

export const DEG2RAD = Math.PI / 180
export const RAD2DEG = 1 / DEG2RAD

export const rotateCounterclockwise = ([x, y]: Tuple, deg: Degree) => {
  const outY = Math.sin(deg * DEG2RAD) * x + Math.cos(deg * DEG2RAD) * y
  const outX = Math.cos(deg * DEG2RAD) * x - Math.sin(deg * DEG2RAD) * y
  return [outX, outY]
}

/*
    outer box's dimension after rotation.
*/
export const getRotateCircumDimension = (
  [width, height]: Tuple,
  deg: Degree,
) => {
  const outHeight =
    Math.abs(Math.cos(deg * DEG2RAD) * height) +
    Math.abs(Math.sin(deg * DEG2RAD) * width)
  const outWidth =
    Math.abs(Math.sin(deg * DEG2RAD) * height) +
    Math.abs(Math.cos(deg * DEG2RAD) * width)
  return [outWidth, outHeight]
}

/*
    inscribed (image contained) box's dimension after rotation
*/
export const getRotateInscribeDimension = (
  [width, height]: Tuple,
  deg: Degree,
  innerAspectRatio: AspectRatio,
) => {
  const widthGuessedFromWidth =
    width /
    (innerAspectRatio * Math.abs(Math.sin(deg * DEG2RAD)) +
      Math.abs(Math.cos(deg * DEG2RAD)))
  const widthGuessedFromHeight =
    height /
    (innerAspectRatio * Math.abs(Math.cos(deg * DEG2RAD)) +
      Math.abs(Math.sin(deg * DEG2RAD)))

  const heightGuessedFromWidth = widthGuessedFromWidth * innerAspectRatio
  const heightGuessedFromHeight = widthGuessedFromHeight * innerAspectRatio

  const [outerWidthGuessedFromWidth, outerHeightGuessedFromWidth] =
    getRotateCircumDimension(
      [widthGuessedFromWidth, heightGuessedFromWidth],
      -deg,
    )

  if (
    outerWidthGuessedFromWidth <= width &&
    outerHeightGuessedFromWidth <= height
  ) {
    return [widthGuessedFromWidth, heightGuessedFromWidth]
  }

  return [widthGuessedFromHeight, heightGuessedFromHeight]
}

export const getContextFromCanvasElement = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext(`2d`)

  if (!ctx) {
    const errorMessage = `이미지 편집을 사용할 수 없는 브라우저입니다.`

    toast.error(errorMessage, {
      position: toast.POSITION.BOTTOM_CENTER,
    })
    throw new Error(errorMessage)
  }

  return ctx
}

export const releaseCanvasElement = (canvas: HTMLCanvasElement) => {
  canvas.width = 0
  canvas.height = 0
  canvas.remove()
}

export const createCanvasElement = (width?: number, height?: number) => {
  const element = document.createElement(`canvas`)
  element.width = width || 0
  element.height = height || 0
  return element
}

/*
  changes dest canvas' dimension
*/
export const copyCanvas = (
  source: HTMLCanvasElement,
  dest: HTMLCanvasElement,
) => {
  dest.width = source.width
  dest.height = source.height

  const ctx = getContextFromCanvasElement(dest)
  ctx.drawImage(source, 0, 0)
}
