import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtPayload } from '../models/request'
import { checkSessionId } from '../utils/auth'
import { prisma } from '../utils/prisma'

export const verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId, appId, sessionId } = await request.jwtVerify<JwtPayload>()
    if (!userId || !appId) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }

    const app = await prisma.app.findUnique({ where: { id: appId } })
    if (!app) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }

    if (app.jwtExpireSeconds > 0) {
      if (!sessionId || !(await checkSessionId(sessionId, app.jwtExpireSeconds))) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }
    }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}
