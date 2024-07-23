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
  summary: 'Bind with Solana',
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
  const { userId, appId } = request.user as JwtPayload
  const { solAddress, signature } = request.body

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!user || !app) {
    return reply.status(404).send({ message: 'User or app not found' })
  }
  if (!verifySOL(app.name, solAddress, signature)) {
    return reply.status(400).send({ message: 'Invalid params' })
  }

  const count = await prisma.user.count({ where: { solAddress, appId } })
  if (count > 0) {
    return reply.status(400).send({ message: 'Wallet already binded' })
  }
  await prisma.user.update({
    where: { id: userId },
    data: { solAddress },
  })

  reply.status(200).send({ data: user })
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
