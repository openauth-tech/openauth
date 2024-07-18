import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../utils/prisma'
import { ERROR404_SCHEMA } from '../../../../constants/schema'
import { verifyAdmin } from '../../../../handlers/verifyAdmin'
import { TypeAppSecret } from '@open-auth/sdk-core'
import { randomUUID } from 'node:crypto'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Get secret',
  params: Type.Object({
    appId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeAppSecret,
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

  let secret = app.secret

  if (secret === null) {
    secret = 'oa_' + randomUUID().replaceAll('-', '')
    await prisma.app.update({
      where: { id: appId },
      data: { secret },
    })
  }

  reply.status(200).send({
    data: { secret },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/secret',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
