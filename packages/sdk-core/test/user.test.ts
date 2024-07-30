import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import {
  bindSolanaUser,
  getTestApp,
  logInNewEthereumUser,
  logInNewSolanaUser,
  logInUsernameUser,
  setupAdmin,
} from './lib/helper.ts'
import { OpenAuthClient } from '../client'

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
    const username = 'test_user_' + new Date().getTime()
    const password = 'pass_word_' + new Date().getTime()
    await logInUsernameUser(client, appId, username, password)
    const profile = await client.user.getProfile()
    assert.equal(profile.username, username)

    // update password
    const newPassword = password + '_new'
    await client.user.updatePassword({ oldPassword: password, newPassword })
    await client.user.logInWithUsername({
      appId,
      username,
      password: newPassword,
    })

    const newProfle = await client.user.getProfile()
    assert.equal(newProfle.username, username)
  })

  it('Bind Solana', async () => {
    const { id: appId } = await getTestApp(client)
    await logInNewEthereumUser(client, appId)
    const solanaKeypair = Keypair.generate()
    await bindSolanaUser(client, appId, solanaKeypair)
  })

  it('Wallets', async () => {
    const { id } = await getTestApp(client)
    await logInUsernameUser(client, id)

    const wallets = await client.user.getWallets()
    console.log(wallets.solWallet)
    assert.equal(wallets.solWallet.length, 44)
  })
})
