import { FastifyInstance } from 'fastify'
import { findOrCreateUser } from '../../repositories/user'
import { verifyETH } from '../../utils/auth'
import { Type } from '@fastify/type-provider-typebox'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { JwtPayload } from '../../models/request'

const schema = {
  tags: ['Login'],
  summary: 'Login with Ethereum',
  body: Type.Object({
    appId: Type.String(),
    ethAddress: Type.String(),
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
  const { appId, ethAddress, signature } = request.body

  if (!signature) {
    return reply.status(400).send({ message: 'Missing signature' })
  }
  if (!verifyETH(ethAddress, signature)) {
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
