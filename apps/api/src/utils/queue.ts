import type { QueueOptions } from 'bull'
import Queue from 'bull'

import { REDIS_HOST, REDIS_PORT } from '../constants/env'
import { prisma } from './prisma'

const queueOptions: QueueOptions = {
  redis: { port: REDIS_PORT, host: REDIS_HOST },
  prefix: 'openauth',
}

export interface AvatarQueuePayload {
  userId: string
  imageURL?: string
  skipIfExist?: boolean
}

export const avatarQueue = new Queue<AvatarQueuePayload>('avatar', queueOptions)

export async function fullSyncAvatar() {
  const users = await prisma.user.findMany({
    select: { id: true },
    where: {
      avatar: null,
      telegram: { not: null },
    },
  })
  console.info('start fullSyncAvatar:', users.length)
  for (const user of users) {
    await avatarQueue.add({ userId: user.id })
  }
}
