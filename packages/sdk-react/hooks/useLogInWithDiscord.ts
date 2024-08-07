import { useCallback, useState } from 'react'
import { useOpenAuth } from './useOpenAuth.ts'
import { fetchDiscordUser, useDiscordLogin } from '@open-auth/react-discord'

export function useLogInWithDiscord() {
  const { logIn, config, client } = useOpenAuth()
  const [loading, setLoading] = useState(false)

  const discordLogin = useDiscordLogin({
    clientId: config.discordClientId,
    onError: (error) => {
      console.error(error)
      setLoading(false)
    },
    onSuccess: async (token) => {
      try {
        const user = await fetchDiscordUser(token)
        const data = await client.user.logInWithDiscord({
          appId: config.appId,
          discord: user.id,
          token: token.access_token,
        })
        await logIn(data.token)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    },
  })

  const logInWithDiscord = useCallback(async () => {
    setLoading(true)
    discordLogin()
  }, [discordLogin])

  return {
    logInWithDiscord,
    loading,
  }
}
