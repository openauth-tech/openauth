import { FastifyInstance } from 'fastify'
import { BRAND_NAME, IS_PRODUCTION, MESSAGE_TEXT } from '../../constants/common'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'

const schema = {
  tags: ['Config'],
  summary: 'Get global config',
  response: {
    200: Type.Object({
      data: Type.Object({
        production: Type.Boolean(),
        brand: Type.String(),
        message: Type.String(),
      }),
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  reply.status(200).send({
    data: {
      production: IS_PRODUCTION,
      brand: BRAND_NAME,
      message: MESSAGE_TEXT,
    },
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/global',
    schema,
    handler,
  })
}
