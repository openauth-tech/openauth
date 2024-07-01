import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypeCreateAdmin } from '../../models/types'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { ERROR403_SCHEMA } from '../../constants/schema'

const schema = {
  tags: ['Admin'],
  summary: 'Initialize super admin account',
  body: TypeCreateAdmin,
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
    403: ERROR403_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { username, password: rawPassword } = request.body

  const count = await prisma.admin.count()
  if (count > 0) {
    reply.status(403).send({ message: 'Already initialized' })
    return
  }

  const password = await bcrypt.hash(rawPassword, SALT_ROUNDS)
  await prisma.admin.create({
    data: {
      username,
      password,
    },
  })
  reply.status(200).send({ data: {} })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/setup',
    schema,
    handler,
  })
}
