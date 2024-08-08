import { useCallback } from 'react'

import { popupTwitterLogin } from './src/popup.ts'
import type { CodeResponse, TokenResponse, TwitterUser } from './src/types.ts'
import { basicAuthHeader } from './src/utils.ts'

type UseTwitterLoginParams = {
  clientId?: string
  clientSecret?: string
  onStart: () => void
  onClose: () => void
  onSuccess: (token: TokenResponse) => Promise<void> | void
  onError: (error: string) => Promise<void> | void
}

export function useTwitterLogin({ clientId, clientSecret, onStart, onClose, onSuccess, onError }: UseTwitterLoginParams) {
  return useCallback(() => {
    if (!clientId) {
      throw new Error('Twitter clientId is required')
    }
    if (!clientSecret) {
      throw new Error('Twitter clientSecret is required')
    }
    popupTwitterLogin({
      clientId,
      clientSecret,
      onStart,
      onClose,
      onError: (data) => {
        onError(data.error)
      },
      onSuccess: async (data) => {
        const res = await fetchTwitterAccessToken({
          params: data,
          client_id: clientId,
          client_secret: clientSecret,
        })
        if (res.access_token) {
          onSuccess(res)
        }
      },
    })
  }, [clientId, clientSecret, onClose, onError, onStart, onSuccess])
}

export async function fetchTwitterAccessToken({ params, client_id, client_secret }: { params: CodeResponse, client_id: string, client_secret: string }) {
  const data = {
    ...params,
    client_id,
  }
  const result = await fetch('https://api.twitter.com/2/oauth2/token', {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': basicAuthHeader(client_id, client_secret),
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
  return (await result.json()) as TokenResponse
}

export async function fetchTwitterUser({ access_token }: { access_token: string }) {
  const result = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  })
  return (await result.json()) as TwitterUser
}
