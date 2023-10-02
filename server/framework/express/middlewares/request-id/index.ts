import type { Request, Response, NextFunction, RequestHandler } from 'express'
import expressRequestId from 'express-request-id'
import { Namespace, createNamespace } from 'cls-hooked'

interface RequestWithId extends Request {
  id: string
}

// cls session to pass request Id to use in logging.
// global resource!

let requestIdsNamespace: Namespace | null = null
let initialized = false

const initialize = () => {
  if (initialized) {
    throw new Error(`RequestId already initialized!`)
  }

  initialized = true
  requestIdsNamespace = createNamespace('requestIds')
}

// changed : initialize in module load.
initialize()

export const getRequestId = () => {
  if (!requestIdsNamespace) {
    throw new Error(`Request cls namespace not initialized!`)
  }

  return requestIdsNamespace.get(`requestId`)
}

/*
  it's log prefix. not necessarily a single id format.
  reqid:[REQUEST_ID]
  conid:[CONNECTION_ID] subid:[SUBSCRIPTION_ID]
*/

export const runWithRequestId = <T>(
  requestId: string,
  callback: () => T,
): T => {
  if (!requestIdsNamespace) {
    throw new Error(`Request cls namespace not initialized!`)
  }
  const namespace = requestIdsNamespace

  let resultSet = false
  let result: T | null = null
  namespace.run(() => {
    // assumes addRequestId has appended request id.
    namespace.set(`requestId`, requestId)
    result = callback()
    resultSet = true
  })

  if (!resultSet) {
    throw new Error(`Namspace call should synchronously resolve`)
  }

  return result as T
}

// express middleware
export const requestId = () => {
  if (!requestIdsNamespace) {
    throw new Error(`Request cls namespace not initialized!`)
  }
  const namespace = requestIdsNamespace

  const addRequestId: RequestHandler = expressRequestId({
    setHeader: true,
  })

  const storeExpressRequestIdToCls = (
    req: RequestWithId,
    res: Response,
    next: NextFunction,
  ) => {
    namespace.run(() => {
      namespace.set(`requestId`, `reqid:[${req.id}]`)
      next()
    })
  }

  return [
    addRequestId, // adds request Id
    storeExpressRequestIdToCls as RequestHandler, // stores in cls
  ]
}
