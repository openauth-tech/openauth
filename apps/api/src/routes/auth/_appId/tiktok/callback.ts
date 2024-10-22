import type { FastifyInstance } from 'fastify'

import type { TikTokRedirectQueryParams } from '../../../../models/tiktok'
import { TypeTikTokRedirectQueryParams } from '../../../../models/tiktok'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { prisma } from '../../../../utils/prisma'
import { RedisTools } from '../../../../utils/redis'
import { ERROR500_SCHEMA } from '../../../../utils/schema'
import { getAccessToken } from '../../../../utils/tiktok'

const schema = {
  tags: ['Auth'],
  summary: 'TikTok callback',
  queryString: TypeTikTokRedirectQueryParams,
  response: {
    500: ERROR500_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { error, error_description, code, state } = request.query as TikTokRedirectQueryParams
  const authParams = await RedisTools.getTiktokAuth(state)

  if (!authParams) {
    return reply.status(500).send({ message: 'Invalid or expired login' })
  }
  const { appId, codeVerifier, redirectUri, redirectUrl } = authParams

  const url = new URL(redirectUrl)
  const searchParams = new URLSearchParams(url.search)

  if (error && error_description) {
    searchParams.set('error', error)
    return reply.redirect(`${url.origin}${url.pathname}?${searchParams.toString()}`)
  }

  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app?.tiktokClientKey || !app?.tiktokClientSecret) {
    return reply.status(500).send({ message: 'TikTok client key is not set' })
  }

  searchParams.set('auth_type', 'openauth_tiktok')

  try {
    const { access_token, token_type, open_id } = await getAccessToken({
      code,
      client_key: app.tiktokClientKey,
      client_secret: app.tiktokClientSecret,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })
    searchParams.set('open_id', open_id)
    searchParams.set('access_token', access_token)
    searchParams.set('token_type', token_type)
  } catch (error: any) {
    searchParams.set('error', error.message ?? error.name ?? 'Unknown error')
  }

  reply.redirect(`${url.origin}${url.pathname}?${searchParams.toString()}`)
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/callback',
    schema,
    handler,
  })
}
