export interface DiscordLoginParams {
  clientId: string
  redirectUri?: string
  responseType?: 'token' | 'code'
  scopes?: string[]
}

export interface DiscordLoginConfig extends DiscordLoginParams {
  redirectUri: string
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
  description: string
}

export interface CodeResponse {
  code: string
}

export interface TokenResponse {
  token_type: string
  access_token: string
  expires_in: number
  scope: string[]
  user?: DiscordUser
}

export type SuccessResponse = CodeResponse | TokenResponse

type OnFailureFunc = (error: ErrorResponse) => Promise<void> | void
type OnSuccessFunc = (response: SuccessResponse) => Promise<void> | void

export type UseDiscordLoginParams = DiscordLoginParams & {
  onSuccess?: OnSuccessFunc
  onError?: OnFailureFunc
}

export type CallbackResponse = {
  type: null | 'error' | 'token' | 'code'
  error?: ErrorResponse
  token?: TokenResponse
  code?: CodeResponse
}

export type DiscordLoginPopupParams = DiscordLoginParams & {
  onClose?: () => void
  onError?: (data: ErrorResponse) => void
  onStart?: () => void
  onSuccess?: (data: TokenResponse | CodeResponse) => void
  popupHeight?: number
  popupWidth?: number
}
