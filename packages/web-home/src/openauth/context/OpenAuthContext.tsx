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

  useUpdateGlobalConfig(config, setGlobalConfig)
  useUpdateUserProfile(config, token, setProfile)

  return (
    <GoogleOAuthProvider clientId="452271051220-4il4djv5iv30gli03ospbrg09rppoerq.apps.googleusercontent.com">
      <OpenAuthContext.Provider
        value={{
          config,
          globalConfig,
          token,
          setToken,
          profile,
        }}
      >
        {children}
      </OpenAuthContext.Provider>
    </GoogleOAuthProvider>
  )
}
