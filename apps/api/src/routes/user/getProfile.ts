import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { Type } from '@fastify/type-provider-typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import { TypeUser } from '@open-auth/sdk-core'
import { generateReferCode } from '../../utils/common'

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

  // FIXME：加入 appid
  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  if (!user.referCode) {
    const referCode = generateReferCode()
    user = await prisma.user.update({
      where: { id: userId },
      data: { referCode },
    })
  }

  reply.status(200).send({
    data: {
      id: user.id,
      email: user.email,
      google: user.google,
      twitter: user.twitter,
      referCode: user.referCode,
      apple: user.apple,
      ethAddress: user.ethAddress,
      solAddress: user.solAddress,
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
