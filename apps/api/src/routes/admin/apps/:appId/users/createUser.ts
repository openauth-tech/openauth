import { FastifyInstance } from 'fastify'
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../../models/typebox'
import { Type } from '@fastify/type-provider-typebox'
import { verifyAdmin } from '../../../../../handlers/verifyAdmin'
import { TypeAdminCreateUser, TypeAuthHeaders, TypeUser } from '@open-auth/sdk-core'
import { findOrCreateUser } from '../../../../../repositories/user'
import { ERROR400_SCHEMA } from '../../../../../constants/schema'
import { prisma } from '../../../../../utils/prisma'
import bcrypt from 'bcrypt'

const schema = {
  tags: ['Admin - Apps'],
  summary: 'Create app user',
  params: Type.Object({
    appId: Type.String(),
  }),
  headers: TypeAuthHeaders,
  body: TypeAdminCreateUser,
  response: {
    200: Type.Object({ data: TypeUser }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params
  const { email, ethAddress, solAddress, username, password } = request.body

  if(!email && !ethAddress && !solAddress) {
    let user = await prisma.user.findFirst({
      where: {
        appId,
        username,
      },
    })

    if(user) {
      reply.status(400).send({
        message: 'User existed'
      })
    }

    user = await prisma.user.create({
      data: {
        appId,
        username,
        password: await bcrypt.hash(password as string, 10),
      },
    })

    reply.status(200).send({
      data: user,
    })
  } else {
    const user = await findOrCreateUser({ appId, email, ethAddress, solAddress })
    reply.status(200).send({
      data: user,
    })
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/',
    onRequest: [verifyAdmin],
    schema,
    handler,
  })
}
