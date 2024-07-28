import { prisma } from '../utils/prisma'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../utils/auth'
import { generateReferCode } from '../utils/common'

export async function findOrCreateUser({
  appId,
  google,
  email,
  telegram,
  ethAddress,
  solAddress,
  username,
  password,
}: {
  appId: string
  google?: string
  email?: string
  telegram?: string
  ethAddress?: string
  solAddress?: string
  username?: string
  password?: string
}) {
  if (!email && !google && !ethAddress && !solAddress && !username) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findFirst({
    where: {
      appId,
      google,
      ethAddress,
      solAddress,
      username,
      email,
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
        referCode: generateReferCode(),
        password: await bcrypt.hash(password, SALT_ROUNDS),
      },
    })
  }

  return prisma.user.create({
    data: {
      appId,
      google,
      email,
      telegram,
      ethAddress,
      solAddress,
      referCode: generateReferCode(),
    },
  })
}
