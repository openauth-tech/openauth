import { IOpenAuthConfig } from '../utils/types'
import { OpenAuthContext } from './OpenAuthContext'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { StorageKeys } from '../utils/constants'
import type { GlobalConfig, User } from '@open-auth/sdk-core'
import { OpenAuthClient } from '@open-auth/sdk-core'
import { GoogleOAuthProvider } from '@react-oauth/google'

export function OpenAuthProvider({ config, children }: { config: IOpenAuthConfig; children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | undefined>(StorageKeys.Token, undefined)
  const [profile, setProfile] = useLocalStorage<User | undefined>(StorageKeys.Profile, undefined)
  const [globalConfig, setGlobalConfig] = useLocalStorage<GlobalConfig | undefined>(StorageKeys.Config, undefined)

  const client = useMemo(() => new OpenAuthClient(config.endpoint), [config.endpoint])

  const refetch = useCallback(async () => {
    if (client.user.isAuthorized()) {
      const profile = await client.user.getProfile()
      setProfile(profile)
    } else {
      setProfile(undefined)
    }
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

  useEffect(() => {
    client.user.updateToken(token)
  }, [token])

  useEffect(() => {
    refetch().catch(console.error)
  }, [])

  useEffect(() => {
    if (config.endpoint) {
      client.user
        .getConfig({ appId: config.appId })
        .then((data) => setGlobalConfig(data))
        .catch(console.error)
    }
  }, [client, config, setGlobalConfig])

  let openAuthProvider = (
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
    openAuthProvider = <GoogleOAuthProvider clientId={config.googleClientId}>{openAuthProvider}</GoogleOAuthProvider>
  }

  return openAuthProvider
}
