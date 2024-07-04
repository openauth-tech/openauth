import { GlobalConfig, OpenAuthClient, User } from '@open-auth/sdk-core'
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

  return (
    <GoogleOAuthProvider clientId="452271051220-4il4djv5iv30gli03ospbrg09rppoerq.apps.googleusercontent.com">
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
    </GoogleOAuthProvider>
  )
}

function Updater({ children }: { children: ReactNode }) {
  useUpdateGlobalConfig()
  useUpdateUserProfile()

  return children
}
