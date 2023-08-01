import { customAlphabet } from 'nanoid/non-secure'
import { customRandom, customAlphabet as customAlphabetSecure } from 'nanoid'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const create = (length: number) => {
  return customAlphabet(BASE58, length)()
}

export const createSecure = (length: number) => {
  return customAlphabetSecure(BASE58, length)()
}

// seed is number
export const createWithSeed = (length: number, seed: number) => {
  const rng = mulberry32(seed)

  return customRandom(BASE58, length, (size) => {
    return new Uint8Array(size).map(() => 256 * rng())
  })
}
