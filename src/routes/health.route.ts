import { Router, type Request, type Response, type NextFunction } from 'express'
import { logger } from '../utils/logger'

export const HealthRouter: Router = Router()

// Check server health
HealthRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('Server health checked')
  res.status(200).send({ status: true, statusCode: 200 })
})
