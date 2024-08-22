import { Type } from '@fastify/type-provider-typebox'
import { TypeAuthHeaders, TypeUser } from '@open-auth/sdk-core'
import type { User } from '@prisma/client'
import type { FastifyInstance } from 'fastify'

import { verifyApp } from '../../../handlers/verifyApp'
import type { AppAuthPayload } from '../../../models/request'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { createUserByUsername, findOrCreateUser } from '../../../repositories/findOrCreateUser'
import { transformUserToReponse } from '../../../repositories/transform'
import { avatarQueue } from '../../../utils/queue'
import { ERROR400_SCHEMA } from '../../../utils/schema'

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
  const { username, password, email, ethAddress, solAddress, telegram } = request.body

  let user: User
  if (username && password) {
    user = await createUserByUsername({ appId, username, password })
  } else {
    user = await findOrCreateUser({ appId, email, ethAddress, solAddress, telegram })
    await avatarQueue.add({ userId: user.id }, { removeOnComplete: true })
  }
  const userResponse = transformUserToReponse(user)

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
