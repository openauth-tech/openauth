import { useCallback, useEffect } from 'react'
import { popupDiscordLogin } from './src/popup.ts'
import { DiscordUser, TokenResponse } from './src/types.ts'
import { getQueryAndHash } from './src/utils.ts'

type UseDiscordLoginParams = {
  clientId?: string
  onSuccess: (token: TokenResponse) => Promise<void> | void
  onError: (error: string) => Promise<void> | void
}

export function useDiscordLogin({ clientId, onSuccess, onError }: UseDiscordLoginParams) {
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

  useEffect(() => {
    window.addEventListener('message', eventHandler)
    return () => {
      window.removeEventListener('message', eventHandler)
    }
  }, [])

  return useCallback(() => {
    if (!clientId) {
      throw new Error('Discord clientId is required')
    }
    popupDiscordLogin({
      clientId,
      onStart: () => {},
      onClose: () => {},
      onError: (data) => {
        onError(data.error)
      },
      onSuccess: async (data) => {
        onSuccess(data as TokenResponse)
      },
    })
  }, [clientId, onError, onSuccess])
}

export const fetchDiscordUser = async ({ access_token }: { access_token: string }) => {
  const result = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  })
  return (await result.json()) as DiscordUser
}
