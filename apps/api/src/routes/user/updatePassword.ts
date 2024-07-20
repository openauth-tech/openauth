import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../utils/auth'
import { TypeUpdatePassword } from '@open-auth/sdk-core'

const schema = {
  tags: ['User'],
  summary: 'Update password',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: TypeUpdatePassword,
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload
  const { oldPassword, newPassword } = request.body

  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return reply.status(400).send({ message: 'User not found' })
  }

  const ok = await bcrypt.compare(oldPassword, user.password ?? '')
  if (!ok) {
    return reply.status(400).send({ message: 'Wrong old password' })
  }

  user = await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(newPassword, SALT_ROUNDS) },
  })
  reply.status(200).send({ data: user })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/update-password',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
