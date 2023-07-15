import { Router } from 'express'
import { exampleRouter } from './example'

const rootRouter = Router()

rootRouter.use(exampleRouter)
/*
    This file should get fat as more routers are added. :)
*/

export { rootRouter }
