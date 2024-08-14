import type { DiscordLoginConfig } from './types'

export function generateAuthUrl({ applicationId, responseType, scopes }: DiscordLoginConfig) {
  const searchParams = new URLSearchParams()
  searchParams.append('client_id', applicationId)
  searchParams.append('response_type', responseType)
  searchParams.append('redirect_uri', window.location.origin)
  searchParams.append('scope', scopes.join(' '))

  return `https://discord.com/api/oauth2/authorize?${searchParams.toString()}`
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
