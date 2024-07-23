import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../utils/prisma'

export const verifyApp = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorization = request.headers.authorization ?? ''
    const secret = authorization.slice('Bearer '.length)
    const app = await prisma.app.findUnique({ where: { secret } })
    if (!app) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
    request.user = { appId: app.id }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}