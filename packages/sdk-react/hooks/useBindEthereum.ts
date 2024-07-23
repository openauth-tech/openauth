import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindEthereum() {
  const context = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

  const bindEthereum = useCallback(() => {
    setLoading(true)
    console.log('useBindEthereum', context)
    setLoading(false)
  }, [])

  return {
    bindEthereum,
    loading,
  }
}
