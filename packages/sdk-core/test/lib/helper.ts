import { encodeBase58, ethers } from 'ethers'
import { APP_NAME, PASSWORD, USERNAME } from './constants.ts'
import { OpenAuthClient } from '../../client'
import { App } from '../../types'
import { Keypair } from '@solana/web3.js'
import nacl from 'tweetnacl'

// user
export async function logInNewEthereumUser(client: OpenAuthClient, appId: string) {
  const { message } = await client.user.getConfig({ appId })
  const wallet = ethers.Wallet.createRandom()
  const ethAddress = wallet.address
  const signature = await wallet.signMessage(message)
  const { token } = await client.user.logInWithEthereum({ appId, ethAddress, signature })
  client.user.updateToken(token)
  return { ethAddress, signature }
}

export async function logInNewSolanaUser(client: OpenAuthClient, appId: string) {
  const { message } = await client.user.getConfig({ appId })
  const keypair = Keypair.generate()
  const messageBytes = new TextEncoder().encode(message)
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
  const solAddress = keypair.publicKey.toBase58()
  const { token } = await client.user.logInWithSolana({
    appId,
    solAddress,
    signature: encodeBase58(signature),
  })
  client.user.updateToken(token)
  return { solAddress, signature }
}

export async function bindSolanaUser(client: OpenAuthClient, appId: string, solanaKeypair: Keypair) {
  const { message } = await client.user.getConfig({ appId })
  const messageBytes = new TextEncoder().encode(message)
  const signature = nacl.sign.detached(messageBytes, solanaKeypair.secretKey)
  await client.user.bindWithSolana({
    solAddress: solanaKeypair.publicKey.toBase58(),
    signature: encodeBase58(signature),
  })
  return { signature }
}

// admin
export async function setupAdmin(client: OpenAuthClient) {
  try {
    await client.admin.setup({ username: USERNAME, password: PASSWORD })
  } catch (error) {}

  const { token } = await client.admin.login({
    username: USERNAME,
    password: PASSWORD,
  })
  client.admin.updateToken(token)
}

export async function getTestApp(client: OpenAuthClient): Promise<App> {
  const apps = await client.admin.listApps()
  const app = apps.find((i) => i.name === APP_NAME)
  if (app) {
    return app
  }
  return client.admin.createApp({ name: APP_NAME })
}
