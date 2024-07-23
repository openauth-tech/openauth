import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindGoogle() {
  const context = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

  const bindGoogle = useCallback(() => {
    setLoading(true)
    console.log('useBindGoogle', context)
    setLoading(false)
  }, [])

  return {
    bindGoogle,
    loading,
  }
}
