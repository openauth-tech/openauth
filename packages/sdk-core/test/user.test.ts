import assert from 'node:assert'

import { Keypair } from '@solana/web3.js'

import { OpenAuthClient } from '../client'
import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import { bindSolanaUser, getTestApp, logInNewEthereumUser, logInNewSolanaUser, logInUsernameUser, setupAdmin } from './lib/helper.ts'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth User API', () => {
  before(() => setupAdmin(client))

  it('Log in with Solana', async () => {
    const { id: appId } = await getTestApp(client)
    const { solAddress } = await logInNewSolanaUser(client, appId)
    const profile = await client.user.getProfile()
    assert.equal(profile.solAddress, solAddress)
  })

  it('Log in with Ethereum', async () => {
    const { id: appId } = await getTestApp(client)
    const { ethAddress } = await logInNewEthereumUser(client, appId)
    const profile = await client.user.getProfile()
    assert.equal(profile.ethAddress, ethAddress)
  })

  it('Log in with Username', async () => {
    const { id: appId } = await getTestApp(client)
    const username = `test_user_${Date.now()}`
    const password = `pass_word_${Date.now()}`
    await logInUsernameUser(client, appId, username, password)
    const profile = await client.user.getProfile()
    assert.equal(profile.username, username)

    // update password
    const newPassword = `${password}_new`
    await client.user.updatePassword({ oldPassword: password, newPassword })
    await client.user.logInWithUsername({ appId, username, password: newPassword, type: 'login' })

    const newProfle = await client.user.getProfile()
    assert.equal(newProfle.username, username)
  })

  it('Bind Solana', async () => {
    const { id: appId } = await getTestApp(client)
    await logInNewEthereumUser(client, appId)
    const solanaKeypair = Keypair.generate()
    await bindSolanaUser(client, appId, solanaKeypair)

    const profile = await client.user.getProfile()
    assert.equal(profile.solAddress, solanaKeypair.publicKey.toBase58())
  })

  it('Wallets', async () => {
    const { id } = await getTestApp(client)
    await logInUsernameUser(client, id)

    const wallets = await client.user.getWallets()
    console.info(wallets.solWallet)
    assert.equal(wallets.solWallet.length, 44)
  })

  it('Send Solana Transfer', async () => {
    const { id } = await getTestApp(client)
    await logInUsernameUser(client, id)

    const wallets = await client.user.getWallets()
    console.info('user solWallet:', wallets.solWallet)
    assert(wallets.solWallet.length > 0)

    {
      const { signature } = await client.user.sendSolanaToken({
        rpcUrl: 'https://devnet.sonic.game',
        address: 'GTRCpd5GwML8mxbqcHcunLmVWnxr7fmdd7avCa5KzBAk',
        token: 'SOL',
        amount: 0.00123,
      })
      console.info('transfer SOL signature', signature)
      assert(signature.length > 0)
    }
    {
      const { signature } = await client.user.sendSolanaToken({
        rpcUrl: 'https://devnet.sonic.game',
        address: 'GTRCpd5GwML8mxbqcHcunLmVWnxr7fmdd7avCa5KzBAk',
        token: 'DUccEanNeePrPaVkMf5PBQSJ62UnHoWt49y3uWhhGBeD',
        amount: 1.23,
      })
      console.info('transfer TOKEN signature', signature)
      assert(signature.length > 0)
    }
  })
})
