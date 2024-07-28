import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypeAdminCreateUser, TypeAuthHeaders, TypeUser } from '@open-auth/sdk-core'
import { findOrCreateUser } from '../../../repositories/findOrCreateUser'
import { ERROR400_SCHEMA } from '../../../constants/schema'
import { verifyApp } from '../../../handlers/verifyApp'
import { AppAuthPayload } from '../../../models/request'

const schema = {
  tags: ['App - Users'],
  summary: 'Create user',
  headers: TypeAuthHeaders,
  body: TypeAdminCreateUser,
  response: {
    200: Type.Object({ data: TypeUser }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.user as AppAuthPayload
  const { email, ethAddress, solAddress, username, password, telegram } = request.body
  const user = await findOrCreateUser({ appId, email, ethAddress, solAddress, username, password, telegram })
  reply.status(200).send({
    data: user,
  })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '',
    onRequest: [verifyApp],
    schema,
    handler,
  })
}
