import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { findOrCreateUser } from '../../repositories/user'
import { verifyGoogle } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { JwtPayload } from '../../models/request'

const schema = {
  tags: ['Login'],
  summary: 'Login with Google',
  body: Type.Object({
    appId: Type.String(),
    email: Type.String(),
    signature: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({
        token: Type.String(),
      }),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, email, signature } = request.body as any

  if (!signature) {
    return reply.status(400).send({ message: 'Missing signature' })
  }

  if (!(await verifyGoogle(email, signature))) {
    return reply.status(400).send({ message: 'Invalid Google access token' })
  }

  const user = await findOrCreateUser({ appId, email })
  const jwtPayload: JwtPayload = { userId: user.id, appId }
  const token = await reply.jwtSign(jwtPayload)
  reply.status(200).send({ data: { token } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/google',
    schema,
    handler,
  })
}
