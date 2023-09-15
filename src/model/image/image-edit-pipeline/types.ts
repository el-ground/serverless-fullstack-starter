export type Tuple = [x: number, y: number]
export type Degree = number
export type AspectRatio = number // height = width * aspectRatio

export interface Transform {
  scale: number
  translate: Tuple
  rotate: Degree
}

export const DEFAULT_TRANSFORM: Transform = {
  scale: 1,
  translate: [0, 0],
  rotate: 0,
}
