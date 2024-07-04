import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'

export function useBindSolana() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {}, [])
}
