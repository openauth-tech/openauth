import { Type } from '@fastify/type-provider-typebox'
import { Connection } from '@solana/web3.js'
import type { FastifyInstance } from 'fastify'

import { transferSolanaToken } from '../../../../../crypto/solana/transferSolanaToken'
import { verifyApp } from '../../../../../handlers/verifyApp'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../../models/typebox'
import { prisma } from '../../../../../utils/prisma'
import { ERROR400_SCHEMA } from '../../../../../utils/schema'

const schema = {
  tags: ['App - Users'],
  summary: 'Send Solana token',
  params: Type.Object({
    userId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    rpcUrl: Type.String(),
    address: Type.String(),
    token: Type.String(),
    amount: Type.Number(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({
        signature: Type.String(),
      }),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.params
  const { token, amount, address, rpcUrl } = request.body
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }
  const connection = new Connection(rpcUrl)

  const signature = await transferSolanaToken({ connection, userId, address, amount, token })
  reply.status(200).send({ data: { signature } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/send-token',
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
