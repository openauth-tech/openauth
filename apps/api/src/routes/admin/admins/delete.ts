import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../utils/prisma'
import { verifyAdmin } from '../../../handlers/verifyAdmin'

const schema = {
  tags: ['Admin - Admins'],
  summary: 'Delete admin',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  params: Type.Object({
    id: Type.Number(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { id } = request.params
  await prisma.admin.delete({
    where: {
      id,
    },
  })

  reply.status(200).send({
    data: {},
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
