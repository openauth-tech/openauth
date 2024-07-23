import { ethers } from 'ethers'
import { OpenAuthClient } from '@open-auth/sdk-core'

async function generateEthCredential(message: string) {
  const wallet = ethers.Wallet.createRandom()
  const signature = await wallet.signMessage(message)
  return {
    ethAddress: wallet.address,
    signature: signature,
  }
}

export async function loginNewUserETH(client: OpenAuthClient, appId: string) {
  const { message } = await client.user.getConfig({ appId })
  const { ethAddress, signature } = await generateEthCredential(message)
  const { token } = await client.user.loginWithEthereum({ appId, ethAddress, signature })
  client.user.updateToken(token)
}
