import type { GraphQLError } from 'graphql'
import type { ErrorMessages } from './types'
import { ErrorWCode } from '@/src/util/error'

/*
    onknownError
    knownErrorCodes
*/
export const tryThrowError = <TKnownError extends string>(
  errors: readonly GraphQLError[] | undefined,
  knownErrorMessages?: ErrorMessages<TKnownError>,
) => {
  if (!errors || errors.length === 0) {
    return
  }

  let errorMessage: string = errors[0].message
  let knownErrorCode: TKnownError | undefined

  for (let i = 0; i < errors.length; i += 1) {
    const error = errors[i]
    const code = error.extensions.code as string | undefined

    if (knownErrorMessages && code && code in knownErrorMessages) {
      knownErrorCode = code as TKnownError
      errorMessage = knownErrorMessages[knownErrorCode]
      break
    }
  }

  throw new ErrorWCode(knownErrorCode as string, errorMessage)
}
