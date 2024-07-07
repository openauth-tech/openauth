import { useCallback, useContext } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindGoogle() {
  const context = useContext(OpenAuthContext)

  return useCallback(() => {
    console.log('useBindGoogle', context)
  }, [])
}
