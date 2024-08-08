export interface DiscordLoginParams {
  applicationId: string
  redirectUri?: string
  responseType?: 'token' | 'code'
  scopes?: string[]
}

export interface DiscordLoginConfig extends DiscordLoginParams {
  redirectUri?: string
  responseType: 'token' | 'code'
  scopes: string[]
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  global_name: string | null
  avatar: string | null
  banner: string | null
  accent_color: string | null
  locale: string | null
  verified: boolean
  email: string | null
}

export interface ErrorResponse {
  error: string
}

export interface TokenResponse {
  token_type: string
  access_token: string
  expires_in: number
  scope: string[]
  user?: DiscordUser
}

export type DiscordLoginPopupParams = DiscordLoginParams & {
  onStart: () => void
  onClose: () => void
  onSuccess: (data: TokenResponse) => void
  onError: (data: ErrorResponse) => void
  popupHeight?: number
  popupWidth?: number
}
