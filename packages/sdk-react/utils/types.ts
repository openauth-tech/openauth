import { GlobalConfig, OpenAuthClient, User } from '@open-auth/sdk-core'

export interface IOpenAuthConfig {
  appId: string
  endpoint: string
  googleClientId?: string
}

export interface IOpenAuthContext {
  config: IOpenAuthConfig
  client: OpenAuthClient

  globalConfig?: GlobalConfig
  token?: string
  profile?: User

  logIn: (token: string) => Promise<void>
  logOut: () => void
}
