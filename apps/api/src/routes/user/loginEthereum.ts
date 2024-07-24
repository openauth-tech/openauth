import { Type } from '@fastify/type-provider-typebox'
import { TypeEthereumLogin, TypeLoginResponse } from '@open-auth/sdk-core'
import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { findOrCreateUser } from '../../repositories/user'
import { createJwtPayload, verifyETH } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

const schema = {
  tags: ['User'],
  summary: 'Log in with Ethereum',
  body: TypeEthereumLogin,
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId, ethAddress, signature } = request.body

  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app || !verifyETH(app.name, ethAddress, signature)) {
    return reply.status(400).send({ message: 'Invalid ETH signature' })
  }

  const user = await findOrCreateUser({ appId, ethAddress })
  const jwtPayload = await createJwtPayload(user.id, appId, app.jwtExpireSeconds)
  const token = await reply.jwtSign(jwtPayload)
  reply.status(200).send({ data: { token } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-ethereum',
    schema,
    handler,
  })
}
