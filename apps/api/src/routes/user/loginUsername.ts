import { FastifyInstance } from 'fastify'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { JwtPayload } from '../../models/request'
import { TypeLoginResponse, TypeUsernameLogin } from '@open-auth/sdk-core'
import { prisma } from '../../utils/prisma'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../utils/auth'

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

  const jwtPayload: JwtPayload = { userId: user.id, appId }
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
