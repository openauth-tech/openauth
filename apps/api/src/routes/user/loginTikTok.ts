import { Type } from '@fastify/type-provider-typebox'
import { TypeLoginResponse } from '@open-auth/sdk-core'
import type { FastifyInstance } from 'fastify'

import { ERROR400_SCHEMA } from '../../constants/schema'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { findOrCreateUser } from '../../repositories/findOrCreateUser'
import { verifyTikTok } from '../../utils/auth'
import { generateJwtToken } from '../../utils/jwt'
import { prisma } from '../../utils/prisma'
import { avatarQueue } from '../../utils/queue'

const schema = {
  tags: ['User'],
  summary: 'Log in with TikTok',
  body: Type.Object({
    appId: Type.String(),
    tiktok: Type.String(),
    token: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, tiktok, token } = request.body
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app) {
    return reply.status(400).send({ message: 'App not found' })
  }
  const { verified, avatar } = await verifyTikTok(tiktok, token)
  if (!verified) {
    return reply.status(400).send({ message: 'Invalid TikTok access token' })
  }

  const user = await findOrCreateUser({ appId, tiktok })
  const jwtToken = await generateJwtToken(reply, { userId: user.id, appId, jwtTTL: app.jwtTTL })
  await avatarQueue.add({ userId: user.id, imageURL: avatar })
  reply.status(200).send({ data: { token: jwtToken } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-tiktok',
    schema,
    handler,
  })
}
