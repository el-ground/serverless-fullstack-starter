import { customAlphabet } from 'nanoid/non-secure'

const BASE58 = `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`

export const createUuid = (length: number) => {
  return customAlphabet(BASE58, length)()
}
