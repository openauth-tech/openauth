import { Type } from '@fastify/type-provider-typebox'
import { TypeGlobalConfig } from '@open-auth/sdk-core'
import type { FastifyInstance } from 'fastify'

import { IS_PRODUCTION } from '../../constants/env'
import { ERROR404_SCHEMA } from '../../constants/schema'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { getMessageText } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

const schema = {
  tags: ['User'],
  summary: 'Get config',
  querystring: Type.Object({
    appId: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeGlobalConfig,
    }),
    404: ERROR404_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.query
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app) {
    return reply.status(404).send({ message: 'App not found' })
  }

  reply.status(200).send({
    data: {
      production: IS_PRODUCTION,
      brand: app.name,
      message: getMessageText(app.name),
      googleClientId: app.googleClientId ?? undefined,
      discordApplicationId: app.discordApplicationId ?? undefined,
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
