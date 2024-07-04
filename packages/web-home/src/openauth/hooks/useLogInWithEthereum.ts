import { ethers } from 'ethers'
import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'
import { useHttpClient } from '@/openauth/hooks/useHttpClient'
import { getEthereumProvider } from '@/utils/getProvider'

export function useLogInWithEthereum() {
  const { config, globalConfig, setToken } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)
  const http = useHttpClient()

  const connect = useCallback(async () => {
    if (!globalConfig) {
      return
    }
    const provider = getEthereumProvider()
    if (!provider) {
      throw new Error('No wallet found')
    }
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const signature = await signer.signMessage(globalConfig.message)
      const { data } = await http.post('/login/ethereum', { appId: config.appId, ethAddress: address, signature })
      setToken(data.token)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [config, globalConfig, http, setToken])

  return {
    connect,
    loading,
  }
}
