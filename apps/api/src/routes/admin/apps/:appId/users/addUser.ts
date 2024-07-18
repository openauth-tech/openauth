import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { prisma } from '../../../../../utils/prisma'
import { verifyAdmin } from '../../../../../handlers/verifyAdmin'
import { TypePageMeta, TypePageParams, TypeUser } from '@open-auth/sdk-core'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Add app user',
  querystring: TypePageParams,
  params: Type.Object({
    appId: Type.String(),
  }),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Array(TypeUser),
      meta: TypePageMeta,
    }),
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params
  const { page, limit } = request.query
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
    url: '',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
