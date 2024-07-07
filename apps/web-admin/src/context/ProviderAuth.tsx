import { type OpenAuthClient } from '@open-auth/sdk-core'
import { createContext } from 'react'

import { useAppState } from '@/store/app'

const AuthContext = createContext<OpenAuthClient | null>(null)

const ProviderAuth = AuthContext.Provider

const useAuth = () => {
  const authClient = useContext(AuthContext)
  const { token } = useAppState()

  return {
    authClient,
    ready: !!token,
  }
}

export { ProviderAuth, useAuth }
