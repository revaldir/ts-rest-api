import { type Request, type Response } from 'express'
import { createProductValidation, updateProductValidation } from '../validations/product.validation'
import { logger } from '../utils/logger'
import {
  createProductDB,
  deleteProductDB,
  getProductByIdDB,
  getProductDB,
  updateProductDB
} from '../services/product.service'
import { v4 as uuidv4 } from 'uuid'

export const getProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  if (id) {
    const product = await getProductByIdDB(id)
    if (product) {
      logger.info('Get product success')
      return res.status(200).send({ status: true, statusCode: 200, data: product })
    } else {
      return res.status(404).send({ status: true, statusCode: 404, message: 'Product not found', data: {} })
    }
  } else {
    const products: any = await getProductDB()
    logger.info('Get all product success')
    return res.status(200).send({ status: true, statusCode: 200, data: products })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  // Generate product id
  req.body.product_id = uuidv4()

  // Validate data
  const { error, value } = createProductValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = product - create', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    await createProductDB(value)
    logger.info('Success add new product')
    return res.status(201).send({ status: true, statusCode: 201, message: 'Add product success' })
  } catch (error) {
    logger.error('ERR = product - create', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  // Validate data
  const { error, value } = updateProductValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = product - update', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const result = await updateProductDB(id, value)

    if (result) {
      logger.info('Success update product')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Update product success' })
    } else {
      logger.info('Product not found')
      return res.status(404).send({ status: true, statusCode: 404, message: 'Product not found' })
    }
  } catch (error) {
    logger.error('ERR = product - update', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req

  try {
    const result = await deleteProductDB(id)

    if (result) {
      logger.info('Success delete product')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Delete product success' })
    } else {
      logger.info('Product not found')
      return res.status(404).send({ status: true, statusCode: 404, message: 'Product not found' })
    }
  } catch (error) {
    logger.error('ERR = product - delete', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
