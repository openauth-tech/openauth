import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminJwtPayload } from '../models/request'
import { prisma } from '../utils/prisma'

export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorization = request.headers.authorization ?? ''
    const isAppSecret = authorization.startsWith('Bearer oa_')

    // app secret
    if (isAppSecret) {
      if (!request.url.startsWith('/apps/')) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
      const { id } = request.params as { id: string }
      const secret = authorization.slice('Bearer '.length)
      const app = await prisma.app.findUnique({ where: { id, secret } })
      if (!app) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
    }
    // admin token
    else {
      const result = await request.jwtVerify<AdminJwtPayload>()
      if (!result.adminId) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
    }
  } catch (error) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}
