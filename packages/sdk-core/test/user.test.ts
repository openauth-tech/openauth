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

  it('Log in with Telegram', async () => {
    const { id: appId } = await getTestApp(client)
    const { token } = await client.user.logInWithTelegram({
      appId,
      data: 'user=%7B%22id%22%3A5114875806%2C%22first_name%22%3A%22Ocean%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ooocean%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=5806277484178639399&chat_type=sender&auth_date=1722497294&hash=e06cf7acceb79cfc485b0306755e2418c9cc4737c7307525d8a55d0d2b860354',
    })
    client.user.updateToken(token)
    const profile = await client.user.getProfile()
    assert.equal(profile.telegram, '')
  })

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
