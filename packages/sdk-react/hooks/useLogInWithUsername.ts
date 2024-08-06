import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useLogInWithUsername() {
  const { config, globalConfig, logIn, client } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

  const logInWithUsername = useCallback(
    async (username: string, password: string) => {
      setLoading(true)
      try {
        const data = await client.user.logInWithUsername({ appId: config.appId, username, password })
        await logIn(data.token)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        throw error
      }
    },
    [client.app, config.appId, globalConfig]
  )

  return {
    logInWithUsername,
    loading,
  }
}
