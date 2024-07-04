import { OpenAuthClient } from '@open-auth/sdk-core'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createContext, ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import {
  IOpenAuthConfig,
  IOpenAuthContext,
  IOpenAuthGlobalConfig,
  IOpenAuthUserProfile,
} from '@/openauth/context/types'
import { useUpdateGlobalConfig } from '@/openauth/context/useUpdateGlobalConfig'
import { useUpdateUserProfile } from '@/openauth/context/useUpdateUserProfile'
import { OpenAuthStorageKeys } from '@/openauth/utils/constants'

export const OpenAuthContext = createContext<IOpenAuthContext>({} as any)

export function OpenAuthProvider({ config, children }: { config: IOpenAuthConfig; children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | undefined>(OpenAuthStorageKeys.TOKEN, undefined)
  const [globalConfig, setGlobalConfig] = useState<IOpenAuthGlobalConfig>()
  const [profile, setProfile] = useState<IOpenAuthUserProfile>()

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
