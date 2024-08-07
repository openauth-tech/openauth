import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { verifyGoogle } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import { avatarQueue } from '../../utils/queue'

const schema = {
  tags: ['User'],
  summary: 'Bind with Google',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    email: Type.String(),
    token: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, userId } = request.user as JwtPayload
  const { email, token } = request.body

  const exUser = await prisma.user.findFirst({ where: { google: email, appId } })
  if (exUser) {
    return reply.status(400).send({ message: 'Google account already binded' })
  }
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const { verified, avatar } = await verifyGoogle(email, token)
  if (!verified) {
    return reply.status(400).send({ message: 'Invalid params' })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { google: email },
  })
  await avatarQueue.add({ userId, imageURL: avatar, skipIfExist: true })
  reply.status(200).send({ data: user })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/bind-google',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
