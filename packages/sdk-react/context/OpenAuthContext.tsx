import { type GlobalConfig, OpenAuthClient, type User } from '@open-auth/sdk-core'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createContext, ReactNode, useMemo, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { IOpenAuthConfig, IOpenAuthContext } from '../utils/types'
import { OpenAuthStorageKeys } from '../utils/constants'
import { useUpdateGlobalConfig } from './useUpdateGlobalConfig'
import { useUpdateUserProfile } from './useUpdateUserProfile'

export const OpenAuthContext = createContext<IOpenAuthContext>({} as any)

export function OpenAuthProvider({ config, children }: { config: IOpenAuthConfig; children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | undefined>(OpenAuthStorageKeys.TOKEN, undefined)
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>()
  const [profile, setProfile] = useState<User>()

  const client = useMemo(() => new OpenAuthClient(config.endpoint, token), [config.endpoint, token])

  const openAuthProvider = (
    <OpenAuthContext.Provider
      value={{
        config,
        client,
        globalConfig,
        setGlobalConfig,
        token,
        setToken,
        profile,
        setProfile,
      }}
    >
      <Updater>{children}</Updater>
    </OpenAuthContext.Provider>
  )

  if (config.googleClientId) {
    return <GoogleOAuthProvider clientId={config.googleClientId}>{openAuthProvider}</GoogleOAuthProvider>
  }

  return openAuthProvider
}

function Updater({ children }: { children: ReactNode }) {
  useUpdateGlobalConfig()
  useUpdateUserProfile()

  return children
}
