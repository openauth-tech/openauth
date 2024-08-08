import { fetchTwitterUser, useTwitterLogin } from '@open-auth/react-twitter'
import { useState } from 'react'

import { useOpenAuth } from './useOpenAuth'

export function useLogInWithTwitter() {
  const { logIn, config, client } = useOpenAuth()
  const [loading, setLoading] = useState(false)

  const logInWithTwitter = useTwitterLogin({
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
        console.log(user)
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

  return {
    logInWithTwitter,
    loading,
  }
}
