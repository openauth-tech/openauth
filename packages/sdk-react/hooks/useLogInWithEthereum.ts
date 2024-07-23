import { ethers } from 'ethers'
import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'
import { getEthereumProvider } from '../utils/getProvider'

export function useLogInWithEthereum() {
  const { config, globalConfig, setToken, client } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

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
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const signature = await signer.signMessage(globalConfig.message)
      const data = await client.app.loginEthereum({ appId: config.appId, ethAddress: address, signature })
      setToken(data.token)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [client.app, config.appId, globalConfig, setToken])

  return {
    connect,
    loading,
  }
}
