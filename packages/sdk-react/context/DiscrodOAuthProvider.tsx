import { useMemo, ReactNode } from 'react'
import { DiscordOAuthContext } from './DiscordOAuthContext'

interface DiscordOAuthProviderProps {
  clientId: string
  redirectUri?: string
  children: ReactNode
}

export default function DiscordOAuthProvider({ clientId, redirectUri, children }: DiscordOAuthProviderProps) {
  const contextValue = useMemo(
    () => ({
      clientId,
      redirectUri,
    }),
    [clientId, redirectUri]
  )
  return <DiscordOAuthContext.Provider value={contextValue}>{children}</DiscordOAuthContext.Provider>
}
