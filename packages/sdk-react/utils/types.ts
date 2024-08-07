import { GlobalConfig, OpenAuthClient, User } from '@open-auth/sdk-core'

export interface IOpenAuthConfig {
  appId: string
  endpoint: string
  googleClientId?: string
  discordApplicationId?: string
}

export interface IOpenAuthContext {
  config: IOpenAuthConfig
  client: OpenAuthClient

  globalConfig?: GlobalConfig
  token?: string
  profile?: User

  logIn: (token: string) => void
  logOut: () => void
  refetch: () => Promise<void>
}
