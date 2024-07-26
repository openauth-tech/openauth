import { redis } from './redis'
import { JwtPayload } from '../models/request'
import { randomUUID } from 'node:crypto'

export async function validateSession(sessionId: string) {
  const jwtTTL = await redis.get(sessionId)
  if (!jwtTTL) {
    return false
  }
  if (jwtTTL === '0') {
    await redis.set(sessionId, jwtTTL)
  } else {
    await redis.set(sessionId, jwtTTL, 'EX', jwtTTL)
  }

  return true
}

export async function createJwtPayload(userId: string, appId: string, jwtTTL: number): Promise<JwtPayload> {
  const sessionId = randomUUID()
  if (jwtTTL > 0) {
    await redis.set(sessionId, jwtTTL, 'EX', jwtTTL)
  } else {
    await redis.set(sessionId, jwtTTL)
  }

  return { userId, appId, sessionId }
}
