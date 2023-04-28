import bcrypt from 'bcrypt'

export const encode = (string: string) => {
  return bcrypt.hashSync(string, 10)
}

export const checkPassword = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword)
}
