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
  globalConfig?: IOpenAuthGlobalConfig
  token: string | undefined
  setToken: Dispatch<SetStateAction<string | undefined>>
  profile?: IOpenAuthUserProfile
}
