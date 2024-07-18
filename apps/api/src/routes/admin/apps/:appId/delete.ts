import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../utils/prisma'
import { verifyAdmin } from '../../../../handlers/verifyAdmin'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Delete app',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  params: Type.Object({
    appId: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params
  await prisma.app.delete({
    where: {
      id: appId,
    },
  })

  reply.status(200).send({
    data: {},
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'DELETE',
    url: '',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
