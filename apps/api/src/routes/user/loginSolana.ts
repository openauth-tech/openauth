import { Type } from '@fastify/type-provider-typebox'
import { TypeLoginResponse, TypeSolanaLogin } from '@open-auth/sdk-core'
import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { findOrCreateUser } from '../../repositories/user'
import { verifySOL } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { createJwtPayload } from '../../utils/jwt'

const schema = {
  tags: ['User'],
  summary: 'Log in with Solana',
  body: TypeSolanaLogin,
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, solAddress, signature } = request.body
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app || !verifySOL(app.name, solAddress, signature)) {
    return reply.status(400).send({ message: 'Invalid SOL signature' })
  }

  const user = await findOrCreateUser({ appId, solAddress })
  const jwtPayload = await createJwtPayload(user.id, appId, app.jwtTTL)
  const token = await reply.jwtSign(jwtPayload)
  reply.status(200).send({ data: { token } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-solana',
    schema,
    handler,
  })
}
