import { Type } from '@fastify/type-provider-typebox'
import { TypeGoogleLogin, TypeLoginResponse } from '@open-auth/sdk-core'
import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { findOrCreateUser } from '../../repositories/findOrCreateUser'
import { verifyGoogle } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { createJwtPayload } from '../../utils/jwt'

const schema = {
  tags: ['User'],
  summary: 'Log in with Telegram',
  body: TypeGoogleLogin,
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, email, token } = request.body
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app) {
    return reply.status(400).send({ message: 'App not found' })
  }

  if (!token) {
    return reply.status(400).send({ message: 'Missing signature' })
  }

  if (!(await verifyGoogle(email, token))) {
    return reply.status(400).send({ message: 'Invalid Google access token' })
  }

  const user = await findOrCreateUser({ appId, google: email })

  const jwtPayload = await createJwtPayload(user.id, appId, app.jwtTTL)
  const jwtToken = await reply.jwtSign(jwtPayload)
  reply.status(200).send({ data: { token: jwtToken } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-google',
    schema,
    handler,
  })
}
