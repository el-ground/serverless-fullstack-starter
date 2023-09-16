import { FileLike } from '@model/file'
import jsLoadImageToCanvas from './wrapper.js'

/*
  Q : Why do we need load-image-to-canvas?
  A : If we need to edit image, we need it. 

  In order to complete edit-image, implement
  - image-edit-pipeline : file -> base canvas -> transform & filter -> output canvas -> blob. 
  - image editor : use image edit pipeline with gesture (pinch, drag) to change the transform & filter.
    : real time changes are applied through css
    : export is done through canvas

  You need a way to see the uploaded images. you need image pipeline anyway. 
*/

// type conversion wrapper
const tsLoadImageToCanvas = jsLoadImageToCanvas as unknown as (
  fileOrBlobOrUrl: File | Blob | string,
  // images are upscaled to fit the minWidth and minHeight.
  minWidth: number,
  minHeight: number,
) => Promise<HTMLCanvasElement>

export const loadImageToCanvas = async (
  fileLike: FileLike,
  minWidth: number,
  minHeight: number,
) => {
  if (fileLike.sourceType === `file`) {
    return tsLoadImageToCanvas(fileLike.source, minWidth, minHeight)
  }

  throw new Error(`Only files accepted for now`)
}
