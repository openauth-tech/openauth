import { useCallback, useContext } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindSolana() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {}, [])
}
