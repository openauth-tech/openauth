import { useCallback } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindGoogle() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {}, [])
}
