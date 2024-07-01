import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../utils/prisma'
import { TypeUser } from '../../../models/types'
import { verifyAdmin } from '../../../handlers/verifyAdmin'

const schema = {
  tags: ['Admin'],
  summary: 'List users',
  querystring: Type.Object({
    appId: Type.String(),
    page: Type.Integer(),
    limit: Type.Integer(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Array(TypeUser),
      meta: Type.Object({
        totalItems: Type.Integer(),
        totalPages: Type.Integer(),
      }),
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, page, limit } = request.query
  const totalCount = await prisma.user.count({ where: { appId } })
  const users = await prisma.user.findMany({
    where: { appId },
    take: limit,
    skip: (page - 1) * limit,
  })
  reply.status(200).send({
    data: users,
    meta: {
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
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
