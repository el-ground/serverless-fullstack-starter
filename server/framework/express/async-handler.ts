import type { RequestHandler, Request, Response, NextFunction } from 'express'

type AsyncHandlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>

export const asyncHandler = (handler: AsyncHandlerFunction) =>
  ((req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }) as RequestHandler
