import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'

import User from '../models/User'

interface RequestUsers {
  name: string
  password: string
  email: string
}

class CreateUserService {
  public async execute({ name, email, password }: RequestUsers): Promise<User> {
    const usersRepository = getRepository(User)

    const checkUserExist = await usersRepository.findOne({
      where: { email },
    })

    if (checkUserExist) {
      throw new AppError('Email adress already used.')
    }

    const hashedPassword = await hash(password, 8)

    const user = usersRepository.create({
      email,
      name,
      password: hashedPassword,
    })

    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
