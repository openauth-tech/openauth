import { Type } from '@fastify/type-provider-typebox'
import { TypeLoginResponse } from '@open-auth/sdk-core'
import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { findOrCreateUser } from '../../repositories/findOrCreateUser'
import { verifyDiscord } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { generateJwtToken } from '../../utils/jwt'

const schema = {
  tags: ['User'],
  summary: 'Log in with Discord',
  body: Type.Object({
    appId: Type.String(),
    id: Type.String(),
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
  const { appId, id, token } = request.body
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app) {
    return reply.status(400).send({ message: 'App not found' })
  }

  if (!token) {
    return reply.status(400).send({ message: 'Missing signature' })
  }

  if (!(await verifyDiscord(id, token))) {
    return reply.status(400).send({ message: 'Invalid Discord access token' })
  }

  const user = await findOrCreateUser({ appId, discord: id })

  const jwtToken = await generateJwtToken(reply, { userId: user.id, appId, jwtTTL: app.jwtTTL })
  reply.status(200).send({ data: { token: jwtToken } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-discord',
    schema,
    handler,
  })
}
