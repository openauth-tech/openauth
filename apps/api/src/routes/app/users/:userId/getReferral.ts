import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../utils/prisma'
import { ERROR400_SCHEMA } from '../../../../constants/schema'
import { verifyApp } from '../../../../handlers/verifyApp'
import { AppAuthPayload } from '../../../../models/request'

const schema = {
  tags: ['App - Users'],
  summary: 'Get user referral',
  params: Type.Object({
    userId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({
        referralChain: Type.Array(Type.String()),
        referrals1: Type.Array(
          Type.Object({
            createdAt: Type.Number(),
            userId: Type.String(),
          })
        ),
        referrals2: Type.Array(
          Type.Object({
            createdAt: Type.Number(),
            userId: Type.String(),
          })
        ),
      }),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.user as AppAuthPayload
  const { userId } = request.params
  const user = await prisma.user.findUnique({
    where: { appId, id: userId },
  })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const referralChain = [userId]
  while (true) {
    const referral = await prisma.referral.findUnique({ where: { referee: referralChain[referralChain.length - 1] } })
    if (referral) {
      referralChain.push(referral.referrer)
    } else {
      break
    }
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
      referralChain,
      referrals1: referral1.map((i) => ({ userId: i.referee, createdAt: i.createdAt.getTime() })),
      referrals2: referral2.map((i) => ({ userId: i.referee, createdAt: i.createdAt.getTime() })),
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/referral',
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
