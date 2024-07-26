import { Type } from '@fastify/type-provider-typebox'
import { TypeLoginResponse, TypeUsernameLogin } from '@open-auth/sdk-core'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { SALT_ROUNDS } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { createJwtPayload } from '../../utils/jwt'

const schema = {
  tags: ['User'],
  summary: 'Log in with Username',
  body: TypeUsernameLogin,
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, username, password, isRegister } = request.body

  let user = await prisma.user.findFirst({ where: { appId, username } })

  if (user) {
    if (isRegister) {
      return reply.status(400).send({ message: 'Username already taken' })
    }
    const ok = await bcrypt.compare(password, user.password ?? '')
    if (!ok) {
      return reply.status(400).send({ message: 'Wrong password' })
    }
  } else {
    user = await prisma.user.create({
      data: {
        appId,
        username,
        password: await bcrypt.hash(password, SALT_ROUNDS),
      },
    })
  }

  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app) {
    return reply.status(400).send({ message: 'App not found' })
  }

  const jwtPayload = await createJwtPayload(user.id, appId, app.jwtTTL)
  const token = await reply.jwtSign(jwtPayload)
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
