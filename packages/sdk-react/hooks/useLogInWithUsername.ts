import { useCallback, useState } from 'react'

import { useOpenAuth } from './useOpenAuth.ts'

export function useLogInWithUsername() {
  const { config, globalConfig, logIn, client } = useOpenAuth()
  const [loading, setLoading] = useState(false)

  const logInWithUsername = useCallback(
    async (username: string, password: string) => {
      setLoading(true)
      try {
        const data = await client.user.logInWithUsername({ appId: config.appId, username, password })
        await logIn(data.token)
        setLoading(false)
      }
      catch (error) {
        setLoading(false)
        throw error
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client.app, config.appId, globalConfig],
  )

  return {
    logInWithUsername,
    loading,
  }
}
