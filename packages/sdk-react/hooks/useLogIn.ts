import { useContext } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useLogIn() {
  const { logIn } = useContext(OpenAuthContext)
  return {
    logIn,
  }
}
