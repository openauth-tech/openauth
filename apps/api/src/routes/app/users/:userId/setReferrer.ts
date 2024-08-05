import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../utils/prisma'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR401_SCHEMA } from '../../../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { AppAuthPayload } from '../../../../models/request'
import { verifyApp } from '../../../../handlers/verifyApp'

const schema = {
  tags: ['App - Users'],
  summary: 'Set user referrer',
  params: Type.Object({
    userId: Type.String(),
  }),
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
  const { appId } = request.user as AppAuthPayload
  const { userId } = request.params
  const { referCode } = request.body

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  const referrer = await prisma.user.findUnique({
    where: { appId_referCode: { appId, referCode } },
  })

  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  if (!referrer) {
    return reply.status(404).send({ message: 'Referrer not found' })
  }

  if (referrer.id === user.id) {
    return reply.status(400).send({ message: 'Cannot set yourself as referrer' })
  }

  const referral = await prisma.referral.findFirst({ where: { referee: userId } })
  if (referral) {
    if (referral.referrer === referrer.id) {
      return reply.status(200).send({ data: {} })
    } else {
      return reply.status(401).send({ message: 'You have already set referrer' })
    }
  }

  await prisma.referral.create({
    data: {
      appId: user.appId,
      referrer: referrer.id,
      referee: userId,
    },
  })

  reply.status(200).send({ data: {} })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/bind-referrer',
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
