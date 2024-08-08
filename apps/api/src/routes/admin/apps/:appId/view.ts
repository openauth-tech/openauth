import { Type } from '@fastify/type-provider-typebox'
import { TypeApp } from '@open-auth/sdk-core'
import type { FastifyInstance } from 'fastify'

import { ERROR404_SCHEMA } from '../../../../constants/schema'
import { verifyAdmin } from '../../../../handlers/verifyAdmin'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { prisma } from '../../../../utils/prisma'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Get app',
  params: Type.Object({
    appId: Type.String(),
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
  const { appId } = request.params
  const app = await prisma.app.findUnique({
    where: { id: appId },
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
    url: '',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
