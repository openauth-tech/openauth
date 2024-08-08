/* eslint-disable unicorn/prefer-string-replace-all */
import crypto from 'crypto'

import type { TwitterLoginConfig } from './types.ts'

function sha256(buffer: string) {
  return crypto.createHash('sha256').update(buffer).digest()
}

function base64URLEncode(buffer: Buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]+$/, '')
}

export function buildQueryString(query: Record<string, any>): string {
  return Object.entries(query)
    .map(([key, value]) =>
      key && value
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        : '',
    )
    .join('&')
}

export function basicAuthHeader(client_id: string, client_secret: string) {
  return `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString(
    'base64',
  )}`
}

export function generateAuthUrl({ clientId, scopes }: Omit<TwitterLoginConfig, 'clientSecret'>) {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32))
  const codeChallenge = base64URLEncode(sha256(codeVerifier))
  const searchParams = new URLSearchParams()
  searchParams.append('response_type', 'code')
  searchParams.append('client_id', clientId)
  searchParams.append('redirect_uri', window.location.origin)
  searchParams.append('scope', scopes.join(' '))
  searchParams.append('state', 'state')
  searchParams.append('code_challenge', codeChallenge)
  searchParams.append('code_challenge_method', 's256')

  return {
    url: `https://twitter.com/i/oauth2/authorize?${searchParams.toString()}`,
    codeVerifier,
  }
}

export function getQueryAndHash(location: Location): URLSearchParams {
  const params = new URLSearchParams()

  const query = new URLSearchParams(location.search)
  query.forEach((value, key) => {
    params.set(key, value)
  })

  const fragment = new URLSearchParams(location.hash.slice(1))
  fragment.forEach((value, key) => {
    params.set(key, value)
  })
  return params
}
