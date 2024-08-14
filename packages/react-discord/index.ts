import { useCallback } from 'react'

import { popupDiscordLogin } from './src/popup'
import type { DiscordUser, TokenResponse } from './src/types'

type UseDiscordLoginParams = {
  applicationId?: string
  onStart: () => void
  onClose: () => void
  onSuccess: (token: TokenResponse) => Promise<void> | void
  onError: (error: string) => Promise<void> | void
}

export function useDiscordLogin({ applicationId, onStart, onClose, onSuccess, onError }: UseDiscordLoginParams) {
  return useCallback(() => {
    if (!applicationId) {
      throw new Error('Discord applicationId is required')
    }
    popupDiscordLogin({
      applicationId,
      onStart,
      onClose,
      onError: (data) => {
        onError(data.error)
      },
      onSuccess: async (data) => {
        onSuccess(data as TokenResponse)
      },
    })
  }, [applicationId, onClose, onError, onStart, onSuccess])
}

export async function fetchDiscordUser({ access_token }: { access_token: string }) {
  const result = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  })
  return (await result.json()) as DiscordUser
}
