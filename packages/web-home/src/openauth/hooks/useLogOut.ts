import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'

export function useLogOut() {
  const { setToken } = useContext(OpenAuthContext)
  const logOut = useCallback(async () => {
    setToken(undefined)
  }, [setToken])

  return {
    logOut,
  }
}
