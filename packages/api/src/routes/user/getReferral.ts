import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import { TypeReferral } from '@open-auth/sdk-core'

const schema = {
  tags: ['User'],
  summary: 'Get refer info',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeReferral,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const refer1 = await prisma.referral.findMany({
    where: {
      referrer: userId,
    },
  })

  const refer2Count = await prisma.referral.count({
    where: {
      referrer: { in: refer1.map((r) => r.referee) },
    },
  })

  reply.status(200).send({
    data: {
      refee1Count: refer1.length,
      refee2Count: refer2Count,
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/referral',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
