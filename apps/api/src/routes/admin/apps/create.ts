import { Type } from '@fastify/type-provider-typebox'
import { TypeApp } from '@open-auth/sdk-core'
import type { FastifyInstance } from 'fastify'

import { ERROR400_SCHEMA } from '../../../constants/schema'
import { verifyAdmin } from '../../../handlers/verifyAdmin'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { prisma } from '../../../utils/prisma'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Create app',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    name: Type.String(),
  }),
  response: {
    201: Type.Object({
      data: TypeApp,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { name } = request.body
  // create if not exists

  const exists = await prisma.app.findFirst({
    where: { name },
  })

  if (exists) {
    return reply.status(400).send({ message: 'App already exists' })
  }

  const data = await prisma.app.create({
    data: { name },
  })

  reply.status(201).send({ data })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
