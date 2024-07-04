import { GlobalConfig, OpenAuthClient, User } from '@open-auth/sdk-core'
import { Dispatch, SetStateAction } from 'react'

export interface IOpenAuthConfig {
  appId: string
  endpoint: string
}

export interface IOpenAuthContext {
  config: IOpenAuthConfig
  client: OpenAuthClient

  globalConfig?: GlobalConfig
  setGlobalConfig: Dispatch<SetStateAction<GlobalConfig | undefined>>

  token?: string
  setToken: Dispatch<SetStateAction<string | undefined>>

  profile?: User
  setProfile: Dispatch<SetStateAction<User | undefined>>
}
