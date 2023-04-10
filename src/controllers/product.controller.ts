import { type Request, type Response } from 'express'
import { createProductValidation } from '../validations/product.validation'
import { logger } from '../utils/logger'

export const getProduct = (req: Request, res: Response) => {
  const products = [
    { name: 'Sepatu', price: 20000 },
    { name: 'Tas', price: 350000 }
  ]
  const {
    params: { name }
  } = req

  if (name) {
    const filteredProduct = products.filter((product) => {
      if (product.name === name) return product
    })
    if (filteredProduct.length === 0) {
      logger.info('Product not found')
      return res.status(404).send({ status: false, statusCode: 404, data: {} })
    }
    logger.info('Get product success')
    return res.status(200).send({ status: true, statusCode: 200, data: filteredProduct[0] })
  }

  logger.info('Get all product success')
  return res.status(200).send({ status: true, statusCode: 200, data: products })
}

export const createProduct = (req: Request, res: Response) => {
  // Validate data
  const { error, value } = createProductValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = product - create', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }

  logger.info('Success add new product')
  return res.status(200).send({ status: true, statusCode: 200, message: 'Add product success', data: value })
}
