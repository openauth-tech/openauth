import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../utils/prisma'
import bcrypt from 'bcrypt'
import { verifyAdmin } from '../../../handlers/verifyAdmin'
import { SALT_ROUNDS } from '../../../utils/auth'
import { TypeAdmin, TypeCreateAdmin } from '@open-auth/sdk-core'

const schema = {
  tags: ['Admin - Admins'],
  summary: 'Create admin',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: TypeCreateAdmin,
  response: {
    201: Type.Object({
      data: TypeAdmin,
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { username, password: rawPassword } = request.body
  const password = await bcrypt.hash(rawPassword, SALT_ROUNDS)
  const admin = await prisma.admin.create({
    data: {
      username,
      password,
    },
  })

  reply.status(201).send({ data: admin })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
