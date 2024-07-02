import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import { TypeUser } from '@open-auth/sdk-core'

const schema = {
  tags: ['User'],
  summary: 'Get user profile',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeUser,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload

  const data = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!data) {
    return reply.status(404).send({ message: 'User not found' })
  }

  reply.status(200).send({
    data: {
      id: data.id,
      email: data.email,
      google: data.google,
      twitter: data.twitter,
      apple: data.apple,
      ethAddress: data.ethAddress,
      solAddress: data.solAddress,
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/profile',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
