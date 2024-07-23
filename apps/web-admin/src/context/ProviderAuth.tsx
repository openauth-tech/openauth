import { type OpenAuthClient } from '@open-auth/sdk-core'
import { createContext, FC, PropsWithChildren } from 'react'

import { useAppState } from '@/store/app'

const AuthContext = createContext<OpenAuthClient | null>(null)

const ProviderAuth: FC<
  PropsWithChildren & {
    client: OpenAuthClient
  }
> = ({ client, children }) => {
  return <AuthContext.Provider value={client}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const authClient = useContext(AuthContext)
  const { token } = useAppState()

  useEffect(() => {
    if (token) {
      authClient?.admin.updateToken(token)
    }
  }, [authClient, token])

  return {
    authClient,
    isAuthorized: !!token,
  }
}

export { ProviderAuth, useAuth }
