import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'
import { createUser, getUserByEmail } from '../services/auth.service'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validations/auth.validation'
import { checkPassword, encode } from '../utils/hasher'
// import type UserType from '../types/user.type'
import { signJWT, verifyJWT } from '../utils/jwt'

export const registerUser = async (req: Request, res: Response) => {
  // Generate user id
  req.body.user_id = uuidv4()

  // Validate data
  const { error, value } = createUserValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = auth - register', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    // Hash password
    value.password = `${encode(value.password)}`
    await createUser(value)
    logger.info('Success add new user')
    return res.status(201).send({ status: true, statusCode: 201, message: 'Register success' })
  } catch (error) {
    logger.error('ERR = auth - register', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const createSession = async (req: Request, res: Response) => {
  // Validate data
  const { error, value } = createSessionValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = auth - create session', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    // Get User from db
    const user: any = await getUserByEmail(value.email)
    // Check hashing
    const isValid = checkPassword(value.password, user.password)

    if (!isValid) return res.status(401).json({ status: false, statusCode: 401, message: 'Credentials is not valid' })

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })

    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'Login Success', data: { accessToken, refreshToken } })
  } catch (error) {
    logger.error('ERR = auth - create session', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  // Validate data
  const { error, value } = refreshSessionValidation(req.body)
  // Error Handling
  if (error) {
    logger.error('ERR = auth - refresh session', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const { decoded }: any = verifyJWT(value.refreshToken)

    const user = await getUserByEmail(decoded._doc.email)
    if (!user) return false

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })
    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'Refresh Session Success', data: { accessToken } })
  } catch (error: any) {
    logger.error('ERR = auth - refresh session', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
