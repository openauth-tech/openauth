import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypePageMeta, TypePageParams, TypeUser } from '@open-auth/sdk-core'
import { verifyApp } from '../../../handlers/verifyApp'
import { prisma } from '../../../utils/prisma'
import { AppAuthPayload } from '../../../models/request'
import { Prisma } from '@prisma/client'

const schema = {
  tags: ['App - Users'],
  summary: 'List users',
  querystring: Type.Intersect([
    TypePageParams,
    Type.Object({
      id: Type.Optional(Type.String()),
      sortBy: Type.Optional(Type.String()),
      order: Type.Optional(Type.Union([Type.Literal(Prisma.SortOrder.asc), Type.Literal(Prisma.SortOrder.desc)])),
    }),
  ]),
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
  const { id, page, limit, sortBy, order } = request.query
  const whereFilters: Prisma.UserWhereInput = {
    appId,
  }
  if (id) {
    whereFilters.id = id
  }
  const totalCount = await prisma.user.count({ where: whereFilters })
  const users = await prisma.user.findMany({
    where: whereFilters,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: sortBy ? { [sortBy]: order } : undefined,
  })
  reply.status(200).send({
    data: users.map((i) => ({
      ...i,
      createdAt: i.createdAt.toString(),
      lastSeenAt: i.lastSeenAt?.toString() ?? null,
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
