import mongoose from 'mongoose'
import config from '../config/environment'
import { logger } from './logger'

mongoose
  .connect(`${config.db}`)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((err) => {
    logger.info('Could not connect to DB')
    logger.error(err)
    process.exit(1)
  })
