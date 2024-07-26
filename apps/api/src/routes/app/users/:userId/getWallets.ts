import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../utils/prisma'
import { ERROR404_SCHEMA } from '../../../../constants/schema'
import { verifyApp } from '../../../../handlers/verifyApp'
import { AppAuthPayload } from '../../../../models/request'
import { TypeUserWallets } from '@open-auth/sdk-core'
import { getSolanaWallet } from '../../../../crypto/solana'

const schema = {
  tags: ['App - Users'],
  summary: 'Get wallets',
  params: Type.Object({
    userId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeUserWallets,
    }),
    404: ERROR404_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.user as AppAuthPayload
  const { userId } = request.params
  const data = await prisma.user.findUnique({
    where: { appId, id: userId },
  })
  if (!data) {
    return reply.status(404).send({ message: 'User not found' })
  }
  reply.status(200).send({
    data: {
      solWallet: getSolanaWallet(userId).walletAddress,
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/wallets',
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
