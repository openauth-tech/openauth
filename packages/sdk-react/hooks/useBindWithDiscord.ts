import { useState } from 'react'
import { useOpenAuth } from './useOpenAuth'
import { fetchDiscordUser, useDiscordLogin } from '@open-auth/react-discord'

export function useBindWithDiscord() {
  const { config, client } = useOpenAuth()
  const [loading, setLoading] = useState(false)

  const bindWithDiscord = useDiscordLogin({
    clientId: config.discordClientId,
    onStart: () => {
      setLoading(true)
    },
    onClose: () => {
      setLoading(false)
    },
    onError: (error) => {
      console.error(error)
    },
    onSuccess: async (token) => {
      try {
        const user = await fetchDiscordUser(token)
        await client.user.bindWithDiscord({
          discordId: user.id,
          token: token.access_token,
        })
      } catch (error) {
        console.error(error)
      }
    },
  })

  return {
    bindWithDiscord,
    loading,
  }
}