import { fetchTwitterUser, useTwitterLogin } from '@open-auth/react-twitter'
import { useState } from 'react'

import { useOpenAuth } from './useOpenAuth'

export function useBindWithTwitter() {
  const { config, client, refetch } = useOpenAuth()
  const [loading, setLoading] = useState(false)

  const bindWithTwitter = useTwitterLogin({
    clientId: config.twitterClientId,
    clientSecret: config.twitterClientSecret,
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
        const user = await fetchTwitterUser(token)
        // TODO
        await client.user.bindWithDiscord({
          discordId: user.id,
          token: token.access_token,
        })
        await refetch()
      } catch (error) {
        console.error(error)
      }
    },
  })

  return {
    bindWithTwitter,
    loading,
  }
}
