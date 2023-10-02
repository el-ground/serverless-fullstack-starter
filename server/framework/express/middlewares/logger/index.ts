// http://tostring.it/2014/06/23/advanced-logging-with-nodejs/

import { createLogger, format, transports } from 'winston'
import type { Logger } from 'winston'
import { getRequestId } from '../request-id'
import { create as createUUID } from '#util/uuid'

const processId = createUUID(6)
let logCounter = 0 // to process multiline

const { combine, colorize, simple } = format

// create processId and counter;
// increment counter on each log to generate a unique id;

const prependRequestId = format((info) => {
  const requestId = getRequestId() // accesses request-id
  let message: string = info.message
  if (requestId) {
    message = `${requestId} ${info.message}`
  }

  const prefix = `l:[${processId}:${logCounter}]`

  const newlineSplitMessage = message.split(`\n`)
  const joinedMessage = newlineSplitMessage.join(`\n${prefix} `)

  logCounter += 1
  info.message = `${prefix} ${joinedMessage}`
  return info
})

let logger: Logger | null = null
let initialized = false

const initialize = () => {
  if (initialized) {
    throw new Error(`Logger already initialized!`)
  }

  initialized = true
  logger = createLogger({
    transports: [
      new transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: combine(prependRequestId(), colorize(), simple()),
      }),
    ],
    exitOnError: false,
  })
}

// changed : initialize in module load.
initialize()

/* 
    TODO : log objects 
    TODO : log errors 
*/
export const logInfo = (message: string) => {
  if (!logger) {
    throw new Error(`Logger not initialized!`)
  }

  logger.info(message)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (messageOrError: any) => {
  if (!logger) {
    throw new Error(`Logger not initialized!`)
  }

  if (typeof messageOrError === `string`) {
    logger.error(messageOrError)
    return
  }

  const stack = messageOrError?.stack
  if (stack) {
    logger.error(stack)
    return
  }

  const message = messageOrError?.message
  if (message) {
    logger.error(message)
    return
  }

  // toString
  logger.error(`${messageOrError}`)
}

export const logDebug = (message: string) => {
  if (!logger) {
    throw new Error(`Logger not initialized!`)
  }

  logger.debug(message)
}
