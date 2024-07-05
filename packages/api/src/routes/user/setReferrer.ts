import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR401_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'

const schema = {
  tags: ['User'],
  summary: 'Set referrer',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    referCode: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
    401: ERROR401_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload
  const { referCode } = request.body

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  const referrer = await prisma.user.findUnique({
    where: { referCode },
  })

  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  if (!referrer) {
    return reply.status(404).send({ message: 'Referrer not found' })
  }

  const referCount = await prisma.referral.count({ where: { referee: userId } })
  if (referCount > 0) {
    return reply.status(401).send({ message: 'You have already set referrer' })
  }

  await prisma.referral.create({
    data: {
      appId: user.appId,
      referrer: referrer.id,
      referee: userId,
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { referChain: referrer.referChain ? `${referrer.referChain},${referrer.id}` : referrer.id },
  })

  reply.status(200).send({ data: {} })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/set-referrer',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
