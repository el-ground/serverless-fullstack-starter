import { ImageEditCanvas } from './base'
import { ImageEditPipeline } from '..'
import { applyTransformPipeline } from '../apply-transform-pipeline'
import { applyFilterPipeline } from '../apply-filter-pipeline'
import { createCanvasElement, releaseCanvasElement } from '../util'

export class ImageEditPreviewCanvas extends ImageEditCanvas {
  width: number

  constructor(pipeline: ImageEditPipeline, width: number) {
    super(`preview`, pipeline)
    this.width = width
  }

  static async create(pipeline: ImageEditPipeline, width: number) {
    const canvas = new ImageEditPreviewCanvas(pipeline, width)
    await canvas.render()
    canvas.pipeline.previewCanvases.push(canvas)
    return canvas
  }

  // @Virtual
  async _render() {
    const { pipeline, element } = this
    element.width = this.width
    element.height = this.width * this.pipeline.aspectRatio

    const { sourceCanvas, handle } = await pipeline.useValidSourceCanvas()

    const filteredCanvasElement = createCanvasElement()
    await applyFilterPipeline(sourceCanvas.element, filteredCanvasElement)
    sourceCanvas.finishUse(handle)

    await applyTransformPipeline(
      filteredCanvasElement,
      element,
      pipeline.transform,
      pipeline.aspectRatio,
    )
    releaseCanvasElement(filteredCanvasElement)
  }

  // @Virtual
  removeSelfFromPipeline() {
    const index = this.pipeline.previewCanvases.indexOf(this)
    if (index !== -1) {
      this.pipeline.previewCanvases.splice(index, 1)
    }
  }
}
