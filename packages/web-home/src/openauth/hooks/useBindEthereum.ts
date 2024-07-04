import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'

export function useBindEthereum() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {}, [])
}
