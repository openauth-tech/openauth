import { Redis } from 'ioredis'

import { REDIS_HOST, REDIS_PORT } from '../constants'

export const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT, keyPrefix: 'openauth:' })

export enum RedisKeys {
  TiktokOAuth = 'oauth:tiktok',
}

export interface TiktokAuth {
  appId: string
  codeVerifier: string
  redirectUri: string
  redirectUrl: string
}

export const RedisTools = {
  async saveTiktokAuth(csrfState: string, data: TiktokAuth) {
    return redis.set(`${RedisKeys.TiktokOAuth}:${csrfState}`, JSON.stringify(data), 'EX', 600)
  },

  async getTiktokAuth(csrfState: string): Promise<TiktokAuth | undefined> {
    const data = await redis.get(`${RedisKeys.TiktokOAuth}:${csrfState}`)
    if (!data) {
      return
    }
    return JSON.parse(data)
  },
}
