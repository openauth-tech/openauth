import { Type } from '@fastify/type-provider-typebox'
import { Connection } from '@solana/web3.js'
import type { FastifyInstance } from 'fastify'

import { transferSolanaToken } from '../../../crypto/solana/transferSolanaToken'
import { verifyUser } from '../../../handlers/verifyUser'
import type { JwtPayload } from '../../../models/request'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { prisma } from '../../../utils/prisma'
import { ERROR400_SCHEMA, ERROR500_SCHEMA } from '../../../utils/schema'

const schema = {
  tags: ['User'],
  summary: 'Send Solana token',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    rpcUrl: Type.String(),
    address: Type.String(),
    token: Type.String(),
    amount: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({
        signature: Type.String(),
      }),
    }),
    400: ERROR400_SCHEMA,
    500: ERROR500_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload
  const { token, address, rpcUrl } = request.body
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return reply.status(400).send({ message: 'User not found' })
  }
  const connection = new Connection(rpcUrl)

  try {
    const amount = BigInt(request.body.amount)
    const signature = await transferSolanaToken({ connection, userId, address, amount, token })
    reply.status(200).send({ data: { signature } })
  } catch (error: any) {
    reply.status(500).send({ message: error.message ?? 'Internal RPC error' })
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/send-token',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
