import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import { TypeUser } from '@open-auth/sdk-core'
import { transformUserToReponse } from '../../repositories/transform'

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
  const userResponse = transformUserToReponse(user)

  if (!userResponse) {
    return reply.status(404).send({ message: 'User not found' })
  }

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
