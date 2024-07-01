import { prisma } from '../utils/prisma'

export async function findOrCreateUser({
  appId,
  email,
  ethAddress,
  solAddress,
}: {
  appId: string
  email?: string
  ethAddress?: string
  solAddress?: string
}) {
  if (!email && !ethAddress && !solAddress) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
      ethAddress,
      solAddress,
    },
  })
  if (user) {
    return user
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
