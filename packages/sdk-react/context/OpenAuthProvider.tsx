import type { GlobalConfig, User } from '@open-auth/sdk-core'
import { OpenAuthClient } from '@open-auth/sdk-core'
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { StorageKeys } from '../utils/constants'
import type { IOpenAuthConfig } from '../utils/types'
import { OpenAuthContext } from './OpenAuthContext'

export function OpenAuthProvider({ config, children }: { config: IOpenAuthConfig, children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | undefined>(StorageKeys.Token)
  const [profile, setProfile] = useLocalStorage<User | undefined>(StorageKeys.Profile)
  const [globalConfig, setGlobalConfig] = useLocalStorage<GlobalConfig | undefined>(StorageKeys.Config)

  const client = useMemo(() => new OpenAuthClient(config.endpoint), [config.endpoint])

  const refetch = useCallback(async () => {
    if (client.user.isAuthorized()) {
      const profile = await client.user.getProfile()
      setProfile(profile)
    }
    else {
      setProfile(undefined)
    }
  }, [client, setProfile])

  const updateToken = useCallback(
    async (token?: string) => {
      setToken(token)
      client.user.updateToken(token)
      await refetch()
    },
    [setToken, client, refetch],
  )

  const logIn = useCallback((token: string) => updateToken(token), [client, updateToken])
  const logOut = useCallback(() => updateToken(), [client, updateToken])

  useEffect(() => {
    client.user.updateToken(token)
    refetch().catch(console.error)
  }, [])

  useEffect(() => {
    if (config.endpoint) {
      client.user
        .getConfig({ appId: config.appId })
        .then(data => setGlobalConfig(data))
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
