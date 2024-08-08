import { Type } from '@fastify/type-provider-typebox'
import { TypeUser } from '@open-auth/sdk-core'
import type { FastifyInstance } from 'fastify'

import { ERROR400_SCHEMA } from '../../constants/schema'
import { verifyUser } from '../../handlers/verifyUser'
import type { JwtPayload } from '../../models/request'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { transformUserToReponse } from '../../repositories/transform'
import { prisma } from '../../utils/prisma'

const schema = {
  tags: ['User'],
  summary: 'Get profile',
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const userResponse = transformUserToReponse(user)

  reply.status(200).send({
    data: userResponse,
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
