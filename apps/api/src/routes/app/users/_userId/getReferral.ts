import { Type } from '@fastify/type-provider-typebox'
import type { FastifyInstance } from 'fastify'

import { verifyApp } from '../../../../handlers/verifyApp'
import type { AppAuthPayload } from '../../../../models/request'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { prisma } from '../../../../utils/prisma'
import { ERROR400_SCHEMA } from '../../../../utils/schema'

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
        referrals1: Type.Array(Type.String()),
        referrals2: Type.Array(Type.String()),
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
    const referral = await prisma.referral.findUnique({ where: { referee: referralChain.at(-1) } })
    if (referral) {
      referralChain.push(referral.referrer)
    } else {
      break
    }
  }

  const referral1 = await prisma.referral.findMany({
    select: { referee: true },
    where: { referrer: userId },
  })

  const referral2 = await prisma.referral.findMany({
    select: { referee: true },
    where: { referrer: { in: referral1.map(r => r.referee) } },
  })

  reply.status(200).send({
    data: {
      referralChain,
      referrals1: referral1.map(i => i.referee),
      referrals2: referral2.map(i => i.referee),
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
