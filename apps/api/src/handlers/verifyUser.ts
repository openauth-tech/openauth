import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtPayload } from '../models/request'

export const verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await request.jwtVerify<JwtPayload>()

    if (!result.userId || !result.appId) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}
