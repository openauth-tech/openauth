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

  const updateToken = useCallback(
    async (token?: string) => {
      setToken(token)
      client.user.updateToken(token)
      await refetch()
    },
    [setToken, client, refetch],
  )

  const logIn = useCallback((token: string) => updateToken(token), [updateToken])
  const logOut = useCallback(() => updateToken(), [updateToken])

  useEffect(() => {
    client.user.updateToken(token)
    refetch().catch(console.error)
  }, [client.user, refetch, token])

  useEffect(() => {
    if (config.endpoint) {
      client.user
        .getConfig({ appId: config.appId })
        .then(data => setGlobalConfig(data))
        .catch(console.error)
    }
  }, [client, config, setGlobalConfig])

  const value = useMemo(() => ({
    config,
    client,
    globalConfig,
    token,
    profile,
    logIn,
    logOut,
    refetch,
  }), [client, config, globalConfig, logIn, logOut, profile, refetch, token])

  let openAuthProvider = <OpenAuthContext.Provider value={value}>{children}</OpenAuthContext.Provider>

  if (config.googleClientId) {
    openAuthProvider = <GoogleOAuthProvider clientId={config.googleClientId}>{openAuthProvider}</GoogleOAuthProvider>
  }

  return openAuthProvider
}
