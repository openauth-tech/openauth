import type { GlobalConfig, OpenAuthClient, UserProfile } from '@open-auth/sdk-core'

export interface IOpenAuthConfig {
  appId: string
  endpoint: string
  googleClientId?: string
  discordApplicationId?: string
  redirectUri?: string
  callbackUrl?: string
}

export interface IOpenAuthContext {
  config: IOpenAuthConfig
  client: OpenAuthClient

  globalConfig?: GlobalConfig
  token?: string
  profile?: UserProfile

  logIn: (token: string) => void
  logOut: () => void
  refetch: () => Promise<void>
}
