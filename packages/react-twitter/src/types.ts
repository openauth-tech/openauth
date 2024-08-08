export type OAuth2Scopes =
  | 'tweet.read'
  | 'users.read'

export interface TwitterLoginParams {
  clientId: string
  clientSecret: string
  redirectUri?: string
  scopes?: OAuth2Scopes[]
}

export interface TwitterLoginConfig extends TwitterLoginParams {
  redirectUri?: string
  scopes: OAuth2Scopes[]
}

export interface TwitterUser {
  id: string
  username: string
  name: string
  protected: boolean
  location: string
  url: string
  description: string
  most_recent_tweet_id: string
}

export interface ErrorResponse {
  error: string
}

export interface CodeResponse {
  code: string
  grant_type: string
  code_verifier?: string
  redirect_uri: string
}

export interface TokenResponse {
  token_type: string
  access_token: string
  expires_in: number
  scope: string
  refresh_token?: string
  user?: TwitterUser
}

export type TwitterLoginPopupParams = TwitterLoginParams & {
  onStart: () => void
  onClose: () => void
  onSuccess: (data: CodeResponse) => void
  onError: (data: ErrorResponse) => void
  popupHeight?: number
  popupWidth?: number
}
