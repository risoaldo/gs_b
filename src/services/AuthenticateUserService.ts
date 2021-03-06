import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import AppError from '../errors/AppError'

import authConfig from '../config/auth'
import User from '../models/User'

interface RequestAuth {
  email: string
  password: string
}

interface RespnseAuth {
  user: User
  token: string
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestAuth): Promise<RespnseAuth> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new AppError('Invalid email or password.', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Invalid email or password.', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    })

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService
