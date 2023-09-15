import type { ImageEditPipeline } from '../'
import { createCanvasElement, releaseCanvasElement } from '../util'

export type ImageEditCanvasType = `source` | `preview`

/*
    Wrapper for the canvas to manage allocation easier.
    Only to be used within pipeline.
*/
export class ImageEditCanvas {
  pipeline: ImageEditPipeline
  element: HTMLCanvasElement
  type: ImageEditCanvasType
  markedReleased: boolean
  released: boolean
  referenceHandles: number[]
  referenceHandleCounter: number
  isRendering: boolean

  constructor(type: ImageEditCanvasType, pipeline: ImageEditPipeline) {
    this.referenceHandles = []
    this.referenceHandleCounter = 0
    this.pipeline = pipeline
    this.type = type
    this.element = createCanvasElement()
    this.markedReleased = false
    this.released = false
    this.isRendering = false
  }

  // @Virtual
  async _render() {
    throw new Error(`Must implement!`)
  }

  // @Virtual
  async render() {
    // set task runner here!
    if (this.isRendering || this.released) {
      // no multiple render calls at once :)
      return
    }
    this.isRendering = true

    const counterAtStart = this.pipeline.stateCounter

    await this._render()

    this.isRendering = false
    // state updated! re-update
    if (counterAtStart !== this.pipeline.stateCounter) {
      await this.render()
    }
  }

  // @Virtual
  removeSelfFromPipeline() {
    throw new Error(`Must Implement!`)
  }

  /*
    Simple reference counting mechansim when multiple tasks are using the same canvas.
    Copying, Blob exporting, etc tasks might use the same canvas for multiple purposes.
  */
  use() {
    if (this.released) {
      throw new Error(`Canvas is already released!`)
    }

    if (this.markedReleased) {
      throw new Error(`Canvas is already marked released!`)
    }

    const handle = this.referenceHandleCounter
    this.referenceHandles.push(handle)
    this.referenceHandleCounter += 1
    return handle
  }

  finishUse(handle: number) {
    const index = this.referenceHandles.indexOf(handle)
    if (index === -1) {
      throw new Error(`Cannot finish use of unregistered handle!`)
    }

    this.referenceHandles.splice(index, 1)
    // no ref and marked release, release!
    if (this.referenceHandles.length === 0 && this.markedReleased) {
      this._release()
    }
  }

  // internal use only.
  _release() {
    if (!this.markReleased) {
      throw new Error(`Must mark release before being released!`)
    }

    if (!this.element || this.released) {
      throw new Error(`Canvas is already released!`)
    }

    if (this.referenceHandles.length !== 0) {
      throw new Error(`Cannot release when references are alive!`)
    }

    releaseCanvasElement(this.element)

    this.released = true

    this.removeSelfFromPipeline()

    // the canvas will be gc-ed if no refs exist.
  }

  /*
    Use it to release the resource.
  */
  markReleased() {
    if (this.released) {
      throw new Error(`Canvas is already released!`)
    }
    if (this.markedReleased) {
      throw new Error(`Canvas is already marked released!`)
    }

    this.markedReleased = true
    if (this.referenceHandles.length === 0) {
      this._release()
    }
  }
}
