import { encodeBase58 } from 'ethers'
import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'
import { useHttpClient } from '@/openauth/hooks/useHttpClient'
import { getSolanaProvider } from '@/utils/getProvider'

export function useLogInWithSolana() {
  const { config, globalConfig, setToken } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)
  const http = useHttpClient()

  const connect = useCallback(async () => {
    if (!globalConfig) {
      return
    }
    const provider = getSolanaProvider()
    if (!provider) {
      throw new Error('No wallet found')
    }
    setLoading(true)
    try {
      const resp = await provider.connect()
      const address = resp.publicKey.toString()
      const sig = await provider.signMessage(new TextEncoder().encode(globalConfig.message))
      const signature = encodeBase58(sig.signature)
      const { data } = await http.post('/login/solana', { appId: config.appId, solAddress: address, signature })
      setToken(data.token)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [config, setToken, globalConfig, http])

  return {
    connect,
    loading,
  }
}
