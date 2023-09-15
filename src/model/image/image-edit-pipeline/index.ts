import { FileLike } from '@model/file'
import equal from 'deep-equal'
import { taskRunner } from './task-runner'
import { AspectRatio, Transform, DEFAULT_TRANSFORM, Tuple } from './types'
import { ImageEditSourceCanvas } from './image-edit-canvas/source'
import { ImageEditPreviewCanvas } from './image-edit-canvas/preview'
import { createCanvasElement, releaseCanvasElement } from './util'
import { applyFilterPipeline } from './apply-filter-pipeline'
import { applyTransformPipeline } from './apply-transform-pipeline'
import { clampTransform } from './clamp-transform'
import { loadImageToCanvas } from '../load-image-to-canvas'
import { pica } from './pica'

/*
    Image edit & preview & export.
    
    
    Features :
        set aspect ratio
        apply filter
        apply transform
        export
        render preview


    How to use?
        1. request canvas; base vs preview
        2. changed made to the pipeline is propagated to the canvases
        3. release when you're done!
*/

// task runner runs in module scope.
/*
    heavy tasks should run sequentially.
*/
// not use it for now!

export class ImageEditPipeline {
  source: FileLike // static
  sourceMinWidth: number // static
  aspectRatio: AspectRatio
  transform: Transform
  stateCounter: number // increases whenever aspectRatio / transform / filter changes
  sourceCanvases: ImageEditSourceCanvas[]
  previewCanvases: ImageEditPreviewCanvas[]
  //
  latestSourceDimension: Tuple

  constructor(
    source: FileLike,
    sourceMinWidth: number,
    aspectRatio: AspectRatio,
  ) {
    this.source = source
    this.aspectRatio = aspectRatio
    this.sourceMinWidth = sourceMinWidth
    this.transform = DEFAULT_TRANSFORM
    this.sourceCanvases = []
    this.previewCanvases = []
    this.stateCounter = 0
    this.latestSourceDimension = [0, 0]
  }

  setAspectRatio(aspectRatio: AspectRatio) {
    if (aspectRatio === this.aspectRatio) {
      return
    }
    this.stateCounter += 1
    this.aspectRatio = aspectRatio
    this.broadcastRender()
  }

  setTransform(transform: Transform) {
    if (equal(this.latestSourceDimension, [0, 0])) {
      throw new Error(`source not loaded even once!`)
    }

    if (equal(transform, this.transform)) {
      return
    }

    const clampedTransform = clampTransform(
      this.latestSourceDimension,
      this.aspectRatio,
      transform,
    )

    if (equal(clampedTransform, this.transform)) {
      return
    }

    this.stateCounter += 1
    this.transform = clampedTransform
    this.broadcastRender()
  }

  async loadSourceCanvasElement() {
    return taskRunner.run(async () => {
      const canvasElement = await loadImageToCanvas(
        this.source,
        this.sourceMinWidth,
        this.sourceMinWidth * this.aspectRatio,
      )
      this.latestSourceDimension = [canvasElement.width, canvasElement.height]

      return canvasElement
    })
  }

  findValidSourceCanvas() {
    const validSourceCanvas = this.sourceCanvases.find(
      ({ element: { width, height } }) => {
        return (
          width >= this.sourceMinWidth &&
          height >= this.sourceMinWidth * this.aspectRatio
        )
      },
    )
    return validSourceCanvas
  }

  /*
    returns an existing source canvas if exists.
    else, allocates a new source canvas and return.
    MUST call finishUse after use.
  */
  async useValidSourceCanvas() {
    let sourceCanvas: ImageEditSourceCanvas | undefined =
      this.findValidSourceCanvas()

    let handle: number
    if (sourceCanvas) {
      handle = sourceCanvas.use()
    } else {
      sourceCanvas = await ImageEditSourceCanvas.create(this)
      handle = sourceCanvas.use()
      sourceCanvas.markReleased()
    }

    return {
      sourceCanvas,
      handle,
    }
  }

  async broadcastRender() {
    // copy refs
    const sourceCanvses = [...this.sourceCanvases]
    for (let i = 0; i < sourceCanvses.length; i += 1) {
      await sourceCanvses[i].render()
    }

    const { sourceCanvas, handle } = await this.useValidSourceCanvas()
    const previewCanvases = [...this.previewCanvases]
    for (let i = 0; i < previewCanvases.length; i += 1) {
      await previewCanvases[i].render()
    }
    sourceCanvas.finishUse(handle)
  }

  /*
    return a Blob representing the image
  */
  async exportImage(outputWidth: number) {
    const { sourceCanvas, handle } = await this.useValidSourceCanvas()

    const filteredCanvas = createCanvasElement()
    const transformedCanvas = createCanvasElement()

    await applyFilterPipeline(sourceCanvas.element, filteredCanvas)
    sourceCanvas.finishUse(handle)

    transformedCanvas.width = outputWidth
    transformedCanvas.height = outputWidth * this.aspectRatio
    await applyTransformPipeline(
      filteredCanvas,
      transformedCanvas,
      this.transform,
      this.aspectRatio,
    )

    releaseCanvasElement(filteredCanvas)

    const blob = await taskRunner.run(() => {
      return pica.toBlob(transformedCanvas, `image/jpeg`, 0.9)
    })

    releaseCanvasElement(transformedCanvas)
    return blob
  }
}
