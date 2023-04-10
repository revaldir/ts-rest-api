import { Router, type Request, type Response, type NextFunction } from 'express'
import { logger } from '../utils/logger'
import { createProductValidation } from '../validation/product.validation'

export const ProductRouter: Router = Router()

ProductRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('Get all product success')
  return res.status(200).send({ status: true, statusCode: 200, data: [{ name: 'Running Shoes', price: 750000 }] })
})

ProductRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  // Validate data
  const { error, value } = createProductValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = product - create', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }

  logger.info('Success add new product')
  return res.status(200).send({ status: true, statusCode: 200, message: 'Add product success', data: value })
})
