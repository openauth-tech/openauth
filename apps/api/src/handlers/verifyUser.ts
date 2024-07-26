import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtPayload } from '../models/request'
import { validateSession } from '../utils/jwt'

export const verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId, appId, sessionId } = await request.jwtVerify<JwtPayload>()
    if (!userId || !appId || !sessionId) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }

    const isValid = await validateSession(sessionId)
    if (!isValid) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}
