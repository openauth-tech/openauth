import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'

export function useBindGoogle() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {}, [])
}
