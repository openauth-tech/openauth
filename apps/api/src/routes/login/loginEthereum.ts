import { FastifyInstance } from 'fastify'
import { findOrCreateUser } from '../../repositories/user'
import { verifyETH } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { JwtPayload } from '../../models/request'
import { TypeEthereumLogin, TypeLoginResponse } from '@open-auth/sdk-core'
import { prisma } from '../../utils/prisma'

const schema = {
  tags: ['Login'],
  summary: 'Login with Ethereum',
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

  // Tips: 建议加上时间戳校验
  if (!app || !verifyETH(app.name, ethAddress, signature)) {
    return reply.status(400).send({ message: 'Invalid ETH signature' })
  }

  const user = await findOrCreateUser({ appId, ethAddress })
  const jwtPayload: JwtPayload = { userId: user.id, appId }
  const token = await reply.jwtSign(jwtPayload)
  reply.status(200).send({ data: { token } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/ethereum',
    schema,
    handler,
  })
}
