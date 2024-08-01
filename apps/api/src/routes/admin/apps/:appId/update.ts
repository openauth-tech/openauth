import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../utils/prisma'
import { verifyAdmin } from '../../../../handlers/verifyAdmin'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Update app',
  params: Type.Object({
    appId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    logoUrl: Type.Optional(Type.String()),
    emailEnabled: Type.Optional(Type.Boolean()),
    googleEnabled: Type.Optional(Type.Boolean()),
    twitterEnabled: Type.Optional(Type.Boolean()),
    appleEnabled: Type.Optional(Type.Boolean()),
    ethEnabled: Type.Optional(Type.Boolean()),
    solEnabled: Type.Optional(Type.Boolean()),
    jwtTTL: Type.Optional(Type.Number()),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({}),
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params

  const app = await prisma.app.update({
    where: { id: appId },
    data: request.body,
  })

  return reply.status(200).send({ data: app })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'PATCH',
    url: '',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
