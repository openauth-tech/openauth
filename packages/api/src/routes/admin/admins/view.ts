import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypeAdmin } from '../../../models/types'
import { prisma } from '../../../utils/prisma'
import { ERROR404_SCHEMA } from '../../../constants/schema'
import { verifyAdmin } from '../../../handlers/verifyAdmin'

const schema = {
  tags: ['Admin - Admins'],
  summary: 'View admin',
  params: Type.Object({
    id: Type.Number(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeAdmin,
    }),
    404: ERROR404_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { id } = request.params
  const admin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!admin) {
    return reply.status(404).send({ message: 'Admin not found' })
  }
  reply.status(200).send({
    data: admin,
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/:id',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
