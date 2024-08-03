import { Job } from 'bull'
import { uploadAvatar } from '../utils/aws'
import { prisma } from '../utils/prisma'
import { Telegraf } from 'telegraf'

export async function processAvatarJob({ data: { userId } }: Job<{ userId: string }>) {
  console.log(`Processing avatar for user ${userId}`)
  const user = await prisma.user.findUnique({ include: { app: true }, where: { id: userId } })
  const botToken = user?.app.telegramBotToken
  if (!botToken) {
    throw new Error(`No bot token found for user: ${userId}`)
  }
  if (!user.telegram) {
    throw new Error(`No telegram id found for user: ${userId}`)
  }

  const bot = new Telegraf(botToken)
  const photos = await bot.telegram.getUserProfilePhotos(parseInt(user.telegram))
  if (photos.photos.length === 0) {
    console.log(`No avatar found: ${userId}`)
    return
  }
  const photo = photos.photos[0][0]
  const fileLink = await bot.telegram.getFileLink(photo.file_id)
  const url = await uploadAvatar(userId, fileLink.href)
  await prisma.user.update({
    data: { avatar: url },
    where: { id: userId },
  })
}
