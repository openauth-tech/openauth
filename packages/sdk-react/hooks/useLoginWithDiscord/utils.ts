import type {
  DiscordLoginConfig,
  DiscordLoginParams,
  SuccessResponse,
  CodeResponse,
  ErrorResponse,
  TokenResponse,
  DiscordUser,
} from './types'

export const isAccessTokenResponse = (data: SuccessResponse | ErrorResponse): data is TokenResponse =>
  Boolean((data as TokenResponse).access_token)

export const isCodeResponse = (data: SuccessResponse | ErrorResponse): data is CodeResponse =>
  Boolean((data as CodeResponse).code)

export const isErrorResponse = (data: SuccessResponse | ErrorResponse): data is ErrorResponse =>
  Boolean((data as ErrorResponse).error) || Boolean((data as ErrorResponse).description)

export const normalizeDiscordConfig = ({
  clientId,
  redirectUri: uri,
  responseType: type,
  scopes: scopesArray,
}: DiscordLoginParams): DiscordLoginConfig => {
  const redirectUri = uri || window.location.origin
  const responseType = type || 'code'
  const scopes = scopesArray || ['identify']

  return {
    clientId,
    redirectUri,
    responseType,
    scopes,
  }
}

export const generateAuthUrl = ({ clientId, redirectUri, responseType, scopes }: DiscordLoginConfig) => {
  const searchParams = new URLSearchParams()
  searchParams.append('client_id', clientId)
  searchParams.append('response_type', responseType)
  searchParams.append('redirect_uri', redirectUri)
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

export const fetchUser = async (token: TokenResponse) => {
  const result = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${token.token_type} ${token.access_token}`,
    },
  })
  return (await result.json()) as DiscordUser
}
