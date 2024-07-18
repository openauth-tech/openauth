import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../../../utils/prisma'
import { ERROR400_SCHEMA } from '../../../../../../constants/schema'
import { verifyAdmin } from '../../../../../../handlers/verifyAdmin'
import { TypeReferralResponse } from '@open-auth/sdk-core'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Get app user referral',
  params: Type.Object({
    appId: Type.String(),
    userId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeReferralResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, userId } = request.params
  const user = await prisma.user.findUnique({
    where: { appId, id: userId },
  })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const referral1 = await prisma.referral.findMany({
    select: {
      createdAt: true,
      referee: true,
    },
    where: {
      referrer: userId,
    },
  })

  const referral2 = await prisma.referral.findMany({
    select: {
      createdAt: true,
      referee: true,
    },
    where: {
      referrer: { in: referral1.map((r) => r.referee) },
    },
  })

  reply.status(200).send({
    data: {
      referrals1: referral1.map((i) => ({ userId: i.referee, createdAt: i.createdAt.getTime() })),
      referrals2: referral2.map((i) => ({ userId: i.referee, createdAt: i.createdAt.getTime() })),
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/referral',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
