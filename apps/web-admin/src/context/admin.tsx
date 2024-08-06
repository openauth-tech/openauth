import { OpenAuthClient } from '@open-auth/sdk-core'
import { createContext, type ReactNode, useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { OPENAUTH_ENDPOINT } from '@/utils/constants'

export interface IAdminContext {
  client: OpenAuthClient
  username?: string
  setUsername: (username: string) => void
  logIn: (username: string, password: string) => Promise<void>
  logOut: () => void
}

export const AdminContext = createContext<IAdminContext>({} as any)

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage('OpenAuthAdmin:token', '')
  const [username, setUsername] = useLocalStorage('OpenAuthAdmin:username', '')
  useEffect(() => client.admin.updateToken(token), [token])

  const logIn = useCallback(
    async (username: string, password: string) => {
      const { token } = await client.admin.login({
        username,
        password,
      })
      client.admin.updateToken(token)
      setUsername(username)
      setToken(token)
    },
    [setToken, setUsername],
  )

  const logOut = useCallback(() => {
    setUsername('')
    setToken('')
    client.admin.updateToken()
  }, [setToken, setUsername])

  return (
    <AdminContext.Provider
      // eslint-disable-next-line @eslint-react/no-unstable-context-value
      value={{
        client,
        username,
        setUsername,
        logIn,
        logOut,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
