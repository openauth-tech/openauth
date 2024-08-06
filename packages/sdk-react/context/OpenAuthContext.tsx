import { type GlobalConfig, OpenAuthClient, type User } from '@open-auth/sdk-core'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createContext, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { IOpenAuthConfig, IOpenAuthContext } from '../utils/types'
import { StorageKeys } from '../utils/constants'

export const OpenAuthContext = createContext<IOpenAuthContext>({} as any)

export function OpenAuthProvider({ config, children }: { config: IOpenAuthConfig; children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | undefined>(StorageKeys.Token, undefined)
  const [profile, setProfile] = useLocalStorage<User | undefined>(StorageKeys.Profile, undefined)
  const [globalConfig, setGlobalConfig] = useLocalStorage<GlobalConfig | undefined>(StorageKeys.Config, undefined)

  const client = useMemo(() => new OpenAuthClient(config.endpoint), [config.endpoint])

  useEffect(() => client.user.updateToken(token), [token])

  useEffect(() => {
    if (config.endpoint) {
      client.user
        .getConfig({ appId: config.appId })
        .then((data) => setGlobalConfig(data))
        .catch(console.error)
    }
  }, [client, config, setGlobalConfig])

  const refetch = useCallback(async () => {
    const profile = await client.user.getProfile()
    setProfile(profile)
  }, [client, setProfile])

  const logIn = useCallback(
    async (token: string) => {
      client.user.updateToken(token)
      setToken(token)
      await refetch()
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
        refetch,
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
