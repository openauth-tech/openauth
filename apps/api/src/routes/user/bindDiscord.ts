import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { verifyDiscord } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'

const schema = {
  tags: ['User'],
  summary: 'Bind with Discord',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    discord: Type.String(),
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
  const { discord, token } = request.body

  const data = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!data) {
    return reply.status(404).send({ message: 'User not found' })
  }
  if (!discord) {
    return reply.status(400).send({ message: 'Invalid params' })
  }
  if (!(await verifyDiscord(discord, token))) {
    return reply.status(400).send({ message: 'Invalid params' })
  }

  const user = await prisma.user.findFirst({ where: { discord, appId } })
  if (user) {
    return reply.status(400).send({ message: 'Discord account already binded' })
  }
  await prisma.user.update({
    where: { id: userId },
    data: { discord },
  })

  reply.status(200).send({ data })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/bind-discord',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
