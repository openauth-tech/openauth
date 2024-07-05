import { useCallback, useContext } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useLogOut() {
  const { setToken } = useContext(OpenAuthContext)
  const logOut = useCallback(async () => {
    setToken(undefined)
  }, [setToken])

  return {
    logOut,
  }
}
