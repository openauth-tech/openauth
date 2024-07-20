import { FastifyInstance } from 'fastify'
import { prisma } from '../../utils/prisma'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { verifySOL } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { verifyUser } from '../../handlers/verifyUser'
import { JwtPayload } from '../../models/request'
import bcrypt from 'bcrypt'

const schema = {
  tags: ['User'],
  summary: 'Update password',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    password: Type.String(),
    newPassword: Type.String(),
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
  const { password, newPassword } = request.body

  let user = await prisma.user.findUnique({
    where: {
      id: userId
    },
  })
  if(!user) {
    reply.status(400).send({ message: 'User not found' })
  }

  const ok = await bcrypt.compare(password, user?.password as string)
  if(!ok) {
    reply.status(400).send({ message: 'Wrong old password' })
  }

  user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  })
  reply.status(200).send({ data: user })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'PUT',
    url: '/password',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
