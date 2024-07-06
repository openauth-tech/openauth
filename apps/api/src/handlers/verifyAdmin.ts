import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminJwtPayload } from '../models/request'

export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorization = request.headers.authorization
    if (authorization?.startsWith('Bearer oa_')) {
      // api secret key
      return reply.code(401).send({ error: 'Unauthorized' })
    }
    const result = await request.jwtVerify<AdminJwtPayload>()
    if (!result.adminId) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
  } catch (error) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}
