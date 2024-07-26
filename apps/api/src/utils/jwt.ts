import { redis } from './redis'
import { JwtPayload } from '../models/request'
import { randomUUID } from 'node:crypto'

export async function validateSession(sessionId: string) {
  const jwtTTL = await redis.get(sessionId)
  if (!jwtTTL) {
    return false
  }

  await redis.set(sessionId, jwtTTL, 'EX', jwtTTL)
  return true
}

export async function createJwtPayload(userId: string, appId: string, jwtTTL: number): Promise<JwtPayload> {
  const sessionId = jwtTTL > 0 ? randomUUID() : undefined
  if (sessionId) {
    await redis.set(sessionId, jwtTTL, 'EX', jwtTTL)
  }

  return { userId, appId, sessionId }
}
