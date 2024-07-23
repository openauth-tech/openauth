import { type GlobalConfig, OpenAuthClient, type User } from '@open-auth/sdk-core'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { IOpenAuthConfig, IOpenAuthContext } from '../utils/types'
import { OpenAuthStorageKeys } from '../utils/constants'

export const OpenAuthContext = createContext<IOpenAuthContext>({} as any)

export function OpenAuthProvider({ config, children }: { config: IOpenAuthConfig; children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | undefined>(OpenAuthStorageKeys.TOKEN, undefined)
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>()
  const [profile, setProfile] = useState<User>()

  const client = useMemo(() => new OpenAuthClient(config.endpoint), [config.endpoint])

  useEffect(() => {
    if (config.endpoint) {
      client.user
        .getConfig({ appId: config.appId })
        .then((data) => setGlobalConfig(data))
        .catch(console.error)
    }
  }, [client, config, setGlobalConfig])

  const logIn = useCallback(
    async (token: string) => {
      client.user.updateToken(token)
      setToken(token)
      const profile = await client.user.getProfile()
      setProfile(profile)
    },
    [client, setToken]
  )

  const logOut = useCallback(() => {
    client.user.updateToken(token)
    setToken(undefined)
    setProfile(undefined)
  }, [client, setToken])

  const openAuthProvider = (
    <OpenAuthContext.Provider
      value={{
        config,
        client,
        globalConfig,
        token,
        profile,
        logIn,
        logOut,
      }}
    >
      {children}
    </OpenAuthContext.Provider>
  )

  if (config.googleClientId) {
    return <GoogleOAuthProvider clientId={config.googleClientId}>{openAuthProvider}</GoogleOAuthProvider>
  }

  return openAuthProvider
}
