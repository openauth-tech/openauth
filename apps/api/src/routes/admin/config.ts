import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../utils/prisma'
import { TypeAdminConfig } from '@open-auth/sdk-core'

const schema = {
  tags: ['Config'],
  summary: 'Get config',
  response: {
    200: Type.Object({
      data: TypeAdminConfig,
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const adminCount = await prisma.admin.count()
  reply.status(200).send({
    data: {
      initialized: adminCount > 0,
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/config',
    schema,
    handler,
  })
}
