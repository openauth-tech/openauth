import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypeApp } from '../../../models/types'
import { prisma } from '../../../utils/prisma'
import { ERROR404_SCHEMA } from '../../../constants/schema'
import { verifyAdmin } from '../../../handlers/verifyAdmin'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'View app',
  params: Type.Object({
    id: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeApp,
    }),
    404: ERROR404_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { id } = request.params
  const app = await prisma.app.findUnique({
    where: { id },
  })

  if (!app) {
    return reply.status(404).send({ message: 'App not found' })
  }
  reply.status(200).send({
    data: app,
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
