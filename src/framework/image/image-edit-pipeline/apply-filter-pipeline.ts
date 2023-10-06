import { getContextFromCanvasElement } from './util'
import { taskRunner } from './task-runner'

export const applyFilterPipeline = (
  ...args: Parameters<typeof _applyFilterPipeline>
) => taskRunner.run(() => _applyFilterPipeline(...args))

/*
      applies filter and render to the target canvas
  */
export const _applyFilterPipeline = async (
  inputCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement,
) => {
  // DO NOTHING FOR NOW

  const inputWidth = inputCanvas.width
  const inputHeight = inputCanvas.height

  const outputWidth = inputWidth
  const outputHeight = inputHeight

  const inputXOffset = 0
  const inputYOffset = 0
  const outputXOffset = 0
  const outputYOffset = 0

  // outputCanvas.width = inputCanvas.width

  outputCanvas.width = outputWidth
  outputCanvas.height = outputHeight

  const ctx = getContextFromCanvasElement(outputCanvas)

  ctx.drawImage(
    inputCanvas,
    inputXOffset,
    inputYOffset,
    inputWidth,
    inputHeight,
    outputXOffset,
    outputYOffset,
    outputWidth,
    outputHeight,
  )

  return outputCanvas
}
