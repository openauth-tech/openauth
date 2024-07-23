import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import { decodeUTF8 } from 'tweetnacl-util'
import nacl from 'tweetnacl'
import { encodeBase58 } from 'ethers'
import { loginNewUserETH } from './helper'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth API', () => {
  before(async () => {
    try {
      await client.admin.setup({ username: USERNAME, password: PASSWORD })
    } catch (error) {}

    try {
      const { token } = await client.admin.login({
        username: USERNAME,
        password: PASSWORD,
      })
      client.admin.updateToken(token)
    } catch (error) {
      console.error(error)
    }
  })

  it('API + Admin', async () => {
    const { id: appId } = await client.admin.createApp({ name: 'test_api_' + new Date().getTime() })
    const { message } = await client.user.getConfig({ appId })
    const { secret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(secret)

    // login solana
    const keypair = Keypair.generate()
    const messageBytes = decodeUTF8(message)
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
    const { token } = await client.user.loginWithSolana({
      appId,
      solAddress: keypair.publicKey.toBase58(),
      signature: encodeBase58(signature),
    })
    const { data: users } = await client.app.listUsers({ page: 1, limit: 10 })
    assert.equal(users.length, 1)

    // get user profile
    client.user.updateToken(token)
    const { id: userId, referCode, solAddress } = await client.user.getProfile()
    assert.equal(solAddress, keypair.publicKey.toString())
    assert(referCode !== null)

    // test referral1
    let referCode1: string
    {
      const keypair = Keypair.generate()
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
      const { token } = await client.user.loginWithSolana({
        appId,
        solAddress: keypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
      client.user.updateToken(token)
      await client.user.bindReferrer({ referCode })
      const { referCode: code } = await client.user.getProfile()
      assert(code !== null)
      referCode1 = code
    }

    // test referral2
    {
      const keypair = Keypair.generate()
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
      const { token } = await client.user.loginWithSolana({
        appId,
        solAddress: keypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
      client.user.updateToken(token)
      await client.user.bindReferrer({ referCode: referCode1 })
    }

    // verify referral chain
    const referrals = await client.app.getUserReferral(userId)
    assert.equal(referrals.referrals1.length, 1)
    assert.equal(referrals.referrals2.length, 1)
  })

  it('Solana bundle to 2 apps', async () => {
    const solanaKeypair = Keypair.generate()

    {
      const { id: appId } = await client.admin.createApp({ name: 'test_app1_' + new Date().getTime() })
      await loginNewUserETH(client, appId)

      const { message } = await client.user.getConfig({ appId })
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, solanaKeypair.secretKey)
      await client.user.bindWithSolana({
        solAddress: solanaKeypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
    }

    {
      const { id: appId } = await client.admin.createApp({ name: 'test_app2_' + new Date().getTime() })
      await loginNewUserETH(client, appId)

      const { message } = await client.user.getConfig({ appId })
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, solanaKeypair.secretKey)
      await client.user.bindWithSolana({
        solAddress: solanaKeypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
    }
  })

  it('Login with username & update password', async () => {
    const { id: appId } = await client.admin.createApp({ name: 'test_app1_' + new Date().getTime() })

    // login with username
    const userData = {
      username: 'test_' + new Date().getTime(),
      password: '123456',
    }
    await client.app.createUser(userData)
    const { token } = await client.user.loginWithUsername({
      appId,
      username: userData.username,
      password: userData.password,
    })
    assert(token)

    // update password
    client.user.updateToken(token)
    await client.user.updatePassword({ oldPassword: '123456', newPassword: '234567' })
    const { token: token2 } = await client.user.loginWithUsername({
      appId,
      username: userData.username,
      password: '234567',
    })
    assert(token2)
  })
})
