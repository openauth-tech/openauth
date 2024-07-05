import { useCallback, useContext } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindEthereum() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {}, [])
}
