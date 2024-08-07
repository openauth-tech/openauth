import { createContext, useContext } from 'react'

interface DiscordOAuthContextProps {
  clientId: string
  redirectUri?: string
}

export const DiscordOAuthContext = createContext<DiscordOAuthContextProps>(null!)

export function useDiscordOAuth() {
  const context = useContext(DiscordOAuthContext)
  if (!context) {
    throw new Error('Discord OAuth components must be used within DiscordOAuthProvider')
  }
  return context
}
