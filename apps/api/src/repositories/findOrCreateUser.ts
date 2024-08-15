import type { User } from '@prisma/client'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from '../utils/auth'
import { generateReferCode } from '../utils/common'
import { prisma } from '../utils/prisma'

export async function findOrCreateUser({
  appId,
  displayName,
  google,
  discord,
  tiktok,
  email,
  telegram,
  ethAddress,
  solAddress,
  username,
  password,
}: {
  appId: string
  displayName?: string
  google?: string
  discord?: string
  tiktok?: string
  email?: string
  telegram?: string
  ethAddress?: string
  solAddress?: string
  username?: string
  password?: string
}): Promise<User> {
  if (!email && !google && !discord && !tiktok && !ethAddress && !solAddress && !username && !telegram) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findFirst({
    where: {
      appId,
      google,
      discord,
      tiktok,
      email,
      telegram,
      ethAddress,
      solAddress,
      username,
    },
  })
  if (user) {
    return prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: user.displayName ?? displayName,
        lastSeenAt: new Date(),
      },
    })
  }

  if (username) {
    if (!password) {
      throw new Error('password is required')
    }
    return prisma.user.create({
      data: {
        appId,
        username,
        displayName,
        referCode: generateReferCode(),
        password: await bcrypt.hash(password, SALT_ROUNDS),
      },
    })
  }

  return prisma.user.create({
    data: {
      appId,
      google,
      discord,
      tiktok,
      email,
      telegram,
      ethAddress,
      solAddress,
      displayName,
      referCode: generateReferCode(),
    },
  })
}
