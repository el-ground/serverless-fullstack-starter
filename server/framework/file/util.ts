import { createHmac } from 'crypto'
import { getFileKeyStringSymmetric256 } from './key'
import { ResError } from '#util/error'
import { SIGNED_URL_CACHE_WINDOW_SECONDS } from './config'

// https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript

const numberEncoderCharacterSet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
const encodeNumber = (number: number): string => {
  if (
    isNaN(Number(number)) ||
    number === null ||
    number === Number.POSITIVE_INFINITY
  )
    throw new Error('The input is not valid')
  if (number < 0) throw new Error("Can't represent negative numbers now")

  let rixit // like 'digit', only in some non-decimal radix
  let residual = Math.floor(number)
  let result = ''
  while (true) {
    rixit = residual % 64
    // console.log("rixit : " + rixit);
    // console.log("result before : " + result);
    result = numberEncoderCharacterSet.charAt(rixit) + result
    // console.log("result after : " + result);
    // console.log("residual before : " + residual);
    residual = Math.floor(residual / 64)
    // console.log("residual after : " + residual);

    if (residual === 0) break
  }
  return result
}

const decodeNumber = (encodedString: string): number => {
  let result = 0
  const array = encodedString.split('')
  for (let e = 0; e < array.length; e++) {
    result = result * 64 + numberEncoderCharacterSet.indexOf(array[e])
  }
  return result
}

const calculateURICompatibleHash = (content: string) => {
  const key = getFileKeyStringSymmetric256()
  const base64Hash = createHmac('sha256', key)
    .update(content)
    .digest(`base64`)
    .replace(`=`, ``)
  return base64Hash.replaceAll(`+`, `-`).replaceAll(`/`, `_`)
}

/*

  ASDFASDFASDF.<accessLabel>.<iat>.<sha256>
                  decode,       number, replace + pad

  sha256 : 
*/
export const decodeSignedFilePath = (signedFilePath: string) => {
  const dotSplittedArray = signedFilePath.split(`.`)
  //   return `${encodedFilePath}.${encodedAccessLabel}.${encodedCacheBlock}.${urlCompatibleBase64Hash}`

  const givenUrlCompatibleBase64Hash =
    dotSplittedArray[dotSplittedArray.length - 1]
  const encodedCacheBlock = dotSplittedArray[dotSplittedArray.length - 2]
  const encodedAccessLabel = dotSplittedArray[dotSplittedArray.length - 3]
  const encodedFilePath = signedFilePath.slice(
    0,
    signedFilePath.length -
      givenUrlCompatibleBase64Hash.length -
      encodedCacheBlock.length -
      encodedAccessLabel.length -
      3,
  )

  const expectedUrlCompatibleBase64Hash = calculateURICompatibleHash(
    `${encodedFilePath}.${encodedAccessLabel}.${encodedCacheBlock}`,
  )

  if (givenUrlCompatibleBase64Hash !== expectedUrlCompatibleBase64Hash) {
    throw new ResError(
      403,
      `SignedURL hash Validation fail! given : ${givenUrlCompatibleBase64Hash}`,
    )
  }

  const cacheBlockBaseSeconds =
    decodeNumber(encodedCacheBlock) * SIGNED_URL_CACHE_WINDOW_SECONDS
  const accessLabel = decodeURIComponent(encodedAccessLabel)
  const filePath = decodeURIComponent(encodedFilePath)

  if (!filePath) {
    throw new ResError(400, `Cannot parse filePath`)
  }

  if (!accessLabel) {
    throw new ResError(400, `Cannot parse accessLabel`)
  }

  if (!cacheBlockBaseSeconds) {
    throw new ResError(400, `Cannot parse cacheBlockBaseSeconds`)
  }

  return {
    filePath,
    accessLabel,
    cacheBlockBaseSeconds,
  }
}

export const generateSignedFilePath = (
  filePath: string,
  accessLabel: string,
) => {
  if (accessLabel.includes(`.`)) {
    throw new Error(`accessLabel must not include dot!`)
  }

  const currentTimeSeconds = Math.floor(Date.now() / 1000)
  const cacheBlock = Math.floor(
    currentTimeSeconds / SIGNED_URL_CACHE_WINDOW_SECONDS,
  )
  const encodedCacheBlock = encodeNumber(cacheBlock)
  const encodedFilePath = encodeURIComponent(filePath)
  const encodedAccessLabel = encodeURIComponent(accessLabel)

  const urlCompatibleBase64Hash = calculateURICompatibleHash(
    `${encodedFilePath}.${encodedAccessLabel}.${encodedCacheBlock}`,
  )

  return `${encodedFilePath}.${encodedAccessLabel}.${encodedCacheBlock}.${urlCompatibleBase64Hash}`
}
