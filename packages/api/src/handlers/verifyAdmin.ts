import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminJwtPayload } from '../models/request'

export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await request.jwtVerify<AdminJwtPayload>()
    if (!result.adminId) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
  } catch (error) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}
