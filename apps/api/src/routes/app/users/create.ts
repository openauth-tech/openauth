import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { TypeAuthHeaders, TypeUser } from '@open-auth/sdk-core'
import { findOrCreateUser } from '../../../repositories/findOrCreateUser'
import { ERROR400_SCHEMA } from '../../../constants/schema'
import { verifyApp } from '../../../handlers/verifyApp'
import { AppAuthPayload } from '../../../models/request'
import { avatarQueue } from '../../../utils/queue'
import { transformUserToReponse } from '../../../repositories/transform'

const schema = {
  tags: ['App - Users'],
  summary: 'Create user',
  headers: TypeAuthHeaders,
  body: Type.Object({
    email: Type.Optional(Type.String()),
    telegram: Type.Optional(Type.String()),
    ethAddress: Type.Optional(Type.String()),
    solAddress: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    password: Type.Optional(Type.String()),
  }),
  response: {
    200: Type.Object({
      data: TypeUser,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.user as AppAuthPayload
  const { email, ethAddress, solAddress, username, password, telegram } = request.body
  const user = await findOrCreateUser({ appId, email, ethAddress, solAddress, username, password, telegram })
  if (user.telegram) {
    await avatarQueue.add({ userId: user.id })
  }
  const userResponse = transformUserToReponse(user)
  if (!userResponse) {
    throw new Error('transformUserToReponse failed: user response is empty')
  }

  reply.status(200).send({
    data: userResponse,
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
