import { prisma } from '../utils/prisma'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../utils/auth'

export async function findOrCreateUser({
  appId,
  email,
  ethAddress,
  solAddress,
  username,
  password,
}: {
  appId: string
  email?: string
  ethAddress?: string
  solAddress?: string
  username?: string
  password?: string
}) {
  if (!email && !ethAddress && !solAddress && !username) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findFirst({
    where: {
      appId,
      email,
      ethAddress,
      solAddress,
      username,
    },
  })
  if (user) {
    return user
  }

  if (username) {
    if (!password) {
      throw new Error('password is required')
    }
    return prisma.user.create({
      data: {
        appId,
        username,
        password: await bcrypt.hash(password, SALT_ROUNDS),
      },
    })
  }

  return prisma.user.create({
    data: {
      appId,
      email,
      ethAddress,
      solAddress,
    },
  })
}
