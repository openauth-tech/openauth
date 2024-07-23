import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindSolana() {
  const context = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

  const bindSolana = useCallback(() => {
    setLoading(true)
    console.log('useBindSolana', context)
    setLoading(false)
  }, [])

  return {
    bindSolana,
    loading,
  }
}
