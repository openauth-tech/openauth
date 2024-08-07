import { useCallback, useContext, useEffect, useState } from 'react'
import { OpenAuthContext } from '../../context/OpenAuthContext'
import { useDiscordOAuth } from '../../context/DiscordOAuthContext'
import { discordLoginPopup } from './popup'
import type { TokenResponse } from './types'
import { fetchUser, getQueryAndHash } from './utils'

export function useLoginWithDiscord() {
  const { logIn, config, client } = useContext(OpenAuthContext)
  const { clientId, redirectUri } = useDiscordOAuth()
  const [isLoading, setLoading] = useState<boolean>(false)

  const eventHandler = useCallback((event: MessageEvent) => {
    if (event.data.source !== 'open-auth-discord') {
      return
    }
    const params = getQueryAndHash()
    const error = params.get('error')
    const description = params.get('description')
    if (error || description) {
      event.source?.postMessage(
        {
          error,
          description,
        },
        { targetOrigin: event.origin }
      )
    }
    if (event.data.params.responseType === 'code') {
      const code = params.get('code')
      if (code) {
        event.source?.postMessage(
          {
            code: code,
          },
          { targetOrigin: event.origin }
        )
      }
    }
    if (event.data.params.responseType === 'token') {
      const access_token = params.get('access_token')
      if (access_token) {
        const expires_in = params.get('expires_in')
        const token_type = params.get('token_type')
        const scope = params.get('scope')
        event.source?.postMessage(
          {
            access_token,
            expires_in,
            token_type,
            scope,
          },
          { targetOrigin: event.origin }
        )
      }
    }
  }, [])

  const discordLogin = useCallback(async () => {
    discordLoginPopup({
      clientId,
      redirectUri,
      onClose: () => {
        setLoading(false)
      },
      onError: (data) => {
        console.error(data.description)
        setLoading(false)
      },
      onStart: () => {
        setLoading(true)
      },
      onSuccess: async (data) => {
        if ((data as TokenResponse).access_token) {
          // get user
          const user = await fetchUser(data as TokenResponse)
          const result = await client.user.logInWithDiscord({
            appId: config.appId,
            id: user.id,
            token: (data as TokenResponse).access_token,
          })
          await logIn(result.token)
          setLoading(false)
        }
      },
    })
  }, [])

  useEffect(() => {
    window.addEventListener('message', eventHandler)
    return () => {
      window.removeEventListener('message', eventHandler)
    }
  }, [])

  const logInWithDiscrod = useCallback(async () => {
    setLoading(true)
    discordLogin()
  }, [discordLogin])

  return {
    logInWithDiscrod,
    loading: isLoading,
  }
}
