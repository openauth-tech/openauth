import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminJwtPayload } from '../models/request'
import { prisma } from '../utils/prisma'

export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorization = request.headers.authorization ?? ''
    const isAppSecret = authorization.startsWith('Bearer oa_')

    // app secret
    if (isAppSecret) {
      if (!request.url.startsWith('/admin/apps/')) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }
      const { appId } = request.params as { appId: string }
      const secret = authorization.slice('Bearer '.length)
      const app = await prisma.app.findUnique({ where: { id: appId, secret } })
      if (!app) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }
    }
    // admin token
    else {
      const result = await request.jwtVerify<AdminJwtPayload>()

      if (!result.adminId) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }

      const admin = await prisma.admin.findUnique({ where: { id: result.adminId, isDeleted: false } })
      if (!admin) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }
    }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}
