import { ethers } from 'ethers';
import { OpenAuthClient } from '@open-auth/sdk-core'

export async function generateEthCredential(message: string): Promise<any> {
    const wallet = ethers.Wallet.createRandom();
    const signature = await wallet.signMessage(message);
    return {
        ethAddress: wallet.address,
        signature: signature,
    }
}

export async function newUserAndLogin(client: OpenAuthClient, appId: string): Promise<any> {
    const { message } = await client.api.getGlobalConfig(appId)
    const { ethAddress, signature } = await generateEthCredential(message)
    const { token } = await client.api.loginEthereum({ appId, ethAddress, signature })
    await client.api.updateToken(token)
}