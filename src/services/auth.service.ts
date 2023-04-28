import userModel from '../models/user.model'
import type UserType from '../types/user.type'

export const createUser = async (payload: UserType) => {
  return await userModel.create(payload)
}

export const getUserByEmail = async (email: string) => {
  return await userModel.findOne({ email })
}
