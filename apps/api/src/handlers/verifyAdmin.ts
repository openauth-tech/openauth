import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminJwtPayload } from '../models/request'
import { prisma } from '../utils/prisma'

export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorization = request.headers.authorization ?? ''
    const isAppSecret = authorization.startsWith('Bearer oa_')

    // Tips: secret 直接明文传送风险有点高，如果不考虑改变该机制，可以加上 IP 白名单
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

      // FIXME: 不单单是验证该字段，还应该验证当前用户是否还有效（比如：账号被删除）
      if (!result.adminId) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }
    }
  } catch (error) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}
