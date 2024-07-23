import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminJwtPayload } from '../models/request'
import { prisma } from '../utils/prisma'

export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await request.jwtVerify<AdminJwtPayload>()
    if (!result.adminId) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
    const admin = await prisma.admin.findUnique({ where: { id: result.adminId, isDeleted: false } })
    if (!admin) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}
