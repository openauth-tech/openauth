import { ethers } from 'ethers'
import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'
import { getEthereumProvider } from '../utils/getProvider'

export function useLogInWithEthereum() {
  const { config, globalConfig, logIn, client } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

  const logInWithEthereum = useCallback(async () => {
    if (!globalConfig) {
      return
    }
    const ethereum = getEthereumProvider()
    if (!ethereum) {
      throw new Error('No wallet found')
    }
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const signature = await signer.signMessage(globalConfig.message)
      const data = await client.user.logInWithEthereum({ appId: config.appId, ethAddress: address, signature })
      await logIn(data.token)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [client.app, config.appId, globalConfig])

  return {
    logInWithEthereum,
    loading,
  }
}
