import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../utils/prisma'
import { verifyAdmin } from '../../../handlers/verifyAdmin'
import { TypeApp } from '@open-auth/sdk-core'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'List apps',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Array(TypeApp),
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const apps = await prisma.app.findMany()
  reply.status(200).send({
    data: apps,
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
