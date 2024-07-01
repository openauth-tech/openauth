import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { verifySOL } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'

const schema = {
  tags: ['User'],
  summary: 'Bind with Ethereum',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    solAddress: Type.String(),
    signature: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload
  const { solAddress, signature } = request.body

  const data = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!data) {
    return reply.status(404).send({ message: 'User not found' })
  }
  if (!solAddress) {
    return reply.status(400).send({ message: 'Invalid params' })
  }
  if (!verifySOL(solAddress, signature)) {
    return reply.status(400).send({ message: 'Invalid params' })
  }

  const user = await prisma.user.findFirst({ where: { solAddress } })
  if (user) {
    return reply.status(400).send({ message: 'Wallet already binded' })
  }
  await prisma.user.update({
    where: { id: userId },
    data: { solAddress },
  })

  reply.status(200).send({ data })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/bind-solana',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
