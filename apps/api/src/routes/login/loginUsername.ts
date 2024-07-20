import { FastifyInstance } from 'fastify'
import { findOrCreateUser } from '../../repositories/user'
import { verifyETH } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { JwtPayload } from '../../models/request'
import { TypeUsernameLogin, TypeLoginResponse } from '@open-auth/sdk-core'
import { prisma } from '../../utils/prisma'
import bcrypt from "bcrypt";

const schema = {
  tags: ['Login'],
  summary: 'Login with Username',
  body: TypeUsernameLogin,
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, username, password } = request.body
  const user = await await prisma.user.findFirst({ where: { appId, username } })
  if(!user) {
    return reply.status(400).send({ message: 'Not found user' })
  }

  const ok = await bcrypt.compare(password, user.password as string);
  if(!ok) {
    return reply.status(400).send({ message: 'wrong password' })
  }

  const jwtPayload: JwtPayload = { userId: user.id, appId }
  const token = await reply.jwtSign(jwtPayload)
  reply.status(200).send({ data: { token } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/username',
    schema,
    handler,
  })
}
