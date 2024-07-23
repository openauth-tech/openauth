import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { findOrCreateUser } from '../../repositories/user'
import { verifyGoogle } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { JwtPayload } from '../../models/request'
import { TypeGoogleLogin, TypeLoginResponse } from '@open-auth/sdk-core'

const schema = {
  tags: ['User'],
  summary: 'Log in with Google',
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

  if (!token) {
    return reply.status(400).send({ message: 'Missing signature' })
  }

  if (!(await verifyGoogle(email, token))) {
    return reply.status(400).send({ message: 'Invalid Google access token' })
  }

  const user = await findOrCreateUser({ appId, email })
  const jwtPayload: JwtPayload = { userId: user.id, appId }
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
