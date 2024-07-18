import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { verifyAdmin } from '../../../../../handlers/verifyAdmin'
import { TypeAdminCreateUser, TypeAuthHeaders, TypeUser } from '@open-auth/sdk-core'
import { findOrCreateUser } from '../../../../../repositories/user'

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
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params
  const { email, ethAddress, solAddress } = request.body
  const user = await findOrCreateUser({ appId, email, ethAddress, solAddress })
  reply.status(200).send({
    data: user,
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
