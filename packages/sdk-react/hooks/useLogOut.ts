import { useContext } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useLogOut() {
  const { logOut } = useContext(OpenAuthContext)
  return {
    logOut,
  }
}
