import { CodeResponse, DiscordLoginConfig, ErrorResponse, SuccessResponse, TokenResponse } from './types.ts'

export const isAccessTokenResponse = (data: SuccessResponse | ErrorResponse): data is TokenResponse =>
  Boolean((data as TokenResponse).access_token)

export const isCodeResponse = (data: SuccessResponse | ErrorResponse): data is CodeResponse =>
  Boolean((data as CodeResponse).code)

export const isErrorResponse = (data: SuccessResponse | ErrorResponse): data is ErrorResponse =>
  Boolean((data as ErrorResponse).error) || Boolean((data as ErrorResponse).description)

export const generateAuthUrl = ({ clientId, responseType, scopes }: DiscordLoginConfig) => {
  const searchParams = new URLSearchParams()
  searchParams.append('client_id', clientId)
  searchParams.append('response_type', responseType)
  searchParams.append('redirect_uri', window.location.origin)
  searchParams.append('scope', scopes.join(' '))

  return 'https://discord.com/api/oauth2/authorize?' + searchParams.toString()
}

export const getQueryAndHash = (): URLSearchParams => {
  const params = new URLSearchParams()

  const query = new URLSearchParams(window.location.search)
  query.forEach((value, key) => {
    params.set(key, value)
  })

  const fragment = new URLSearchParams(window.location.hash.slice(1))
  fragment.forEach((value, key) => {
    params.set(key, value)
  })
  return params
}
