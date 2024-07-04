import { OpenAuthClient } from '@open-auth/sdk-core'
import { Dispatch, SetStateAction } from 'react'

export interface IOpenAuthConfig {
  appId: string
  endpoint: string
}

export interface IOpenAuthGlobalConfig {
  production: boolean
  brand: string
  message: string
}

export interface IOpenAuthUserProfile {
  id: bigint
  google: string
}

export interface IOpenAuthContext {
  config: IOpenAuthConfig
  client: OpenAuthClient

  globalConfig?: IOpenAuthGlobalConfig
  setGlobalConfig: Dispatch<SetStateAction<IOpenAuthGlobalConfig | undefined>>

  token?: string
  setToken: Dispatch<SetStateAction<string | undefined>>

  profile?: IOpenAuthUserProfile
  setProfile: Dispatch<SetStateAction<IOpenAuthUserProfile | undefined>>
}
