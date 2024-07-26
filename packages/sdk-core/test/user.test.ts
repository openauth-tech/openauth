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

  it('Referral', async () => {
    const { id: appId } = await getTestApp(client)
    const { secret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(secret)

    // login solana
    await logInNewSolanaUser(client, appId)
    const { id: userId, referCode } = await client.user.getProfile()

    // test referral1
    let referCode1: string
    {
      await logInNewSolanaUser(client, appId)
      await client.user.bindReferrer({ referCode })
      const { referCode: code } = await client.user.getProfile()
      assert(code !== null)
      referCode1 = code
    }

    // test referral2
    {
      await logInNewSolanaUser(client, appId)
      await client.user.bindReferrer({ referCode: referCode1 })
    }

    // verify referral chain
    const referrals = await client.app.getUserReferral(userId)
    assert.equal(referrals.referrals1.length, 1)
    assert.equal(referrals.referrals2.length, 1)
  })

  it('Wallets', async () => {
    const { id } = await getTestApp(client)
    await logInUsernameUser(client, id)

    const wallets = await client.user.getWallets()
    console.log(wallets.solWallet)
    assert.equal(wallets.solWallet.length, 44)
  })
})
