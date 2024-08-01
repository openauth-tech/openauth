import { Type } from '@fastify/type-provider-typebox'
import { TypeLoginResponse } from '@open-auth/sdk-core'
import { FastifyInstance } from 'fastify'
import { ERROR400_SCHEMA } from '../../constants/schema'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../models/typebox'

const schema = {
  tags: ['User'],
  summary: 'Log in with Telegram',
  body: Type.Object({
    appId: Type.String(),
    data: Type.String(),
    hash: Type.String(),
  }),
  response: {
    200: Type.Object({
      data: TypeLoginResponse,
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  //
  // const user = await findOrCreateUser({ appId, google: email })
  //
  // const jwtPayload = await createJwtPayload(user.id, appId, app.jwtTTL)
  // const jwtToken = await reply.jwtSign(jwtPayload)
  // reply.status(200).send({ data: { token: jwtToken } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login-telegram',
    schema,
    handler,
  })
}
