import { FastifyInstance } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { JwtPayload } from '../../../models/request'
import { prisma } from '../../../utils/prisma'
import { getSolanaWallet } from '../../../crypto/solana'
import { verifyUser } from '../../../handlers/verifyUser'

const schema = {
  tags: ['User'],
  summary: 'Export Solana private key',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.String(),
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
    data: getSolanaWallet(userId).privateKey,
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/private-key',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
