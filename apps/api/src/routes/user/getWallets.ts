import { FastifyInstance } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { TypeUserWallets } from '@open-auth/sdk-core'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { JwtPayload } from '../../models/request'
import { prisma } from '../../utils/prisma'
import { getSolanaWallet } from '../../crypto/solana'
import { verifyUser } from '../../handlers/verifyUser'

const schema = {
  tags: ['User'],
  summary: 'Get wallets',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeUserWallets,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload

  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
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
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
