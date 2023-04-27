import productModel from '../models/product.model'
import { logger } from '../utils/logger'
import type ProductType from '../types/product.type'

export const createProductDB = async (payload: ProductType) => {
  return await productModel.create(payload)
}

export const getProductDB = async () => {
  return await productModel
    .find()
    .then((data) => {
      return data
    })
    .catch((err) => {
      logger.info('Get product from database failed')
      logger.error(err)
    })
}

export const getProductByIdDB = async (id: string) => {
  return await productModel.findOne({ product_id: id })
}

export const updateProductDB = async (id: string, payload: ProductType) => {
  return await productModel.findOneAndUpdate({ product_id: id }, { $set: payload })
}

export const deleteProductDB = async (id: string) => {
  return await productModel.findOneAndDelete({ product_id: id })
}
