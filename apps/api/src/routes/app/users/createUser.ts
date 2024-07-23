import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypeAdminCreateUser, TypeAuthHeaders, TypeUser } from '@open-auth/sdk-core'
import { findOrCreateUser } from '../../../repositories/user'
import { ERROR400_SCHEMA } from '../../../constants/schema'
import { verifyApp } from '../../../handlers/verifyApp'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Create app user',
  params: Type.Object({
    appId: Type.String(),
  }),
  headers: TypeAuthHeaders,
  body: TypeAdminCreateUser,
  response: {
    200: Type.Object({ data: TypeUser }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params
  const { email, ethAddress, solAddress, username, password } = request.body
  const user = await findOrCreateUser({ appId, email, ethAddress, solAddress, username, password })
  reply.status(200).send({
    data: user,
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/',
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
