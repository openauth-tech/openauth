import { Type } from '@fastify/type-provider-typebox'
import { TypeLoginResponse } from '@open-auth/sdk-core'
import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'

import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { findOrCreateUser } from '../../repositories/findOrCreateUser'
import { generateJwtToken } from '../../utils/jwt'
import { prisma } from '../../utils/prisma'
import { ERROR400_SCHEMA } from '../../utils/schema'

const schema = {
  tags: ['User'],
  summary: 'Log in with Username',
  body: Type.Object({
    appId: Type.String(),
    username: Type.String(),
    password: Type.String(),
    isRegister: Type.Optional(Type.Boolean()),
  }),
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, username, password, isRegister } = request.body
  if (username.length < 3) {
    return reply.status(400).send({ message: 'Username must be at least 3 characters' })
  }
  if (password.length < 6) {
    return reply.status(400).send({ message: 'Password must be at least 6 characters' })
  }
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app) {
    return reply.status(400).send({ message: 'App not found' })
  }

  if (isRegister) {
    const user = await prisma.user.findFirst({ where: { appId, username } })
    if (user) {
      return reply.status(400).send({ message: 'Username already taken' })
    }
  }

  const user = await findOrCreateUser({ appId, username, password })
  const ok = await bcrypt.compare(password, user.password ?? '')
  if (!ok) {
    return reply.status(400).send({ message: 'Wrong password' })
  }

  const token = await generateJwtToken(reply, { userId: user.id, appId, jwtTTL: app.jwtTTL })
  reply.status(200).send({ data: { token } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-username',
    schema,
    handler,
  })
}
