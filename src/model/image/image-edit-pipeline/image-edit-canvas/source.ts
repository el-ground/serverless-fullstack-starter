import { ImageEditCanvas } from './base'
import { ImageEditPipeline } from '..'
import { copyCanvas, releaseCanvasElement } from '../util'

export class ImageEditSourceCanvas extends ImageEditCanvas {
  constructor(pipeline: ImageEditPipeline) {
    super(`source`, pipeline)
  }

  static async create(pipeline: ImageEditPipeline) {
    const canvas = new ImageEditSourceCanvas(pipeline)
    await canvas.render()
    canvas.pipeline.sourceCanvases.push(canvas)
    return canvas
  }

  shouldUpdateSourceCanvas() {
    const { width, height } = this.element
    const { sourceMinWidth, aspectRatio } = this.pipeline
    return width < sourceMinWidth || height < sourceMinWidth * aspectRatio
  }

  // @Virtual
  async _render() {
    const { pipeline, element } = this

    if (this.shouldUpdateSourceCanvas()) {
      const validSourceCanvas = pipeline.findValidSourceCanvas()
      if (validSourceCanvas) {
        copyCanvas(validSourceCanvas.element, element)
      } else {
        // else, load new source canvas
        const loadedSourceCanvasElement =
          await pipeline.loadSourceCanvasElement()
        copyCanvas(loadedSourceCanvasElement, element)
        releaseCanvasElement(loadedSourceCanvasElement)
      }
    }
    this.updateTransformStyle()
  }

  // @Virtual
  removeSelfFromPipeline() {
    const index = this.pipeline.sourceCanvases.indexOf(this)
    if (index !== -1) {
      this.pipeline.sourceCanvases.splice(index, 1)
    }
  }

  /*
    get transform style to apply to the canvas
  */
  updateTransformStyle() {
    const {
      scale,
      translate: [x, y],
      rotate,
    } = this.pipeline.transform

    const canvasAspectRatio = this.element.height / this.element.width
    const baseAspectRatio = this.pipeline.aspectRatio

    const scaleAmount = baseAspectRatio / canvasAspectRatio

    const baseScale = Math.max(scaleAmount, 1)

    const resX = x
    // translate is based on window, but style is applied to canvas. so multiply scaleAmount
    // normalize 0,0 to center.
    const resY = y * scaleAmount + (scaleAmount - 1) / 2
    const resScale = baseScale * scale

    const translateX = 100 * resX
    const translateY = 100 * resY

    const style = `translate(${translateX}%, ${translateY}%) scale(${resScale}, ${resScale}) rotate(${rotate}deg)`
    this.element.style.transform = style
  }
}
