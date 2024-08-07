import { useCallback } from 'react'
import { popupDiscordLogin } from './src/popup.ts'
import { DiscordUser, TokenResponse } from './src/types.ts'

type UseDiscordLoginParams = {
  clientId?: string
  onStart: () => void
  onClose: () => void
  onSuccess: (token: TokenResponse) => Promise<void> | void
  onError: (error: string) => Promise<void> | void
}

export function useDiscordLogin({ clientId, onStart, onClose, onSuccess, onError }: UseDiscordLoginParams) {
  return useCallback(() => {
    if (!clientId) {
      throw new Error('Discord clientId is required')
    }
    popupDiscordLogin({
      clientId,
      onStart,
      onClose,
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
