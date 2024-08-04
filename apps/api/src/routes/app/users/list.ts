import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypePageMeta, TypePageParams, TypeUser } from '@open-auth/sdk-core'
import { verifyApp } from '../../../handlers/verifyApp'
import { prisma } from '../../../utils/prisma'
import { AppAuthPayload } from '../../../models/request'

const schema = {
  tags: ['App - Users'],
  summary: 'List users',
  querystring: TypePageParams,
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
  const { appId } = request.user as AppAuthPayload
  const { page, limit } = request.query
  const totalCount = await prisma.user.count({ where: { appId } })
  const users = await prisma.user.findMany({
    where: { appId },
    take: limit,
    skip: (page - 1) * limit,
  })
  reply.status(200).send({
    data: users.map((user) => ({
      ...user,
      lastSeenAt: user.lastSeenAt.getTime(),
      createdAt: user.createdAt.getTime(),
    })),
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
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
