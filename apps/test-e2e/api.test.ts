import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import { decodeUTF8 } from 'tweetnacl-util'
import nacl from 'tweetnacl'
import { encodeBase58 } from 'ethers'

const adminClient = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth API', () => {
  before(async () => {
    try {
      await adminClient.admin.setup({ username: USERNAME, password: PASSWORD })
    } catch (error) {}

    try {
      const { token } = await adminClient.admin.login({
        username: USERNAME,
        password: PASSWORD,
      })
      adminClient.updateToken(token)
    } catch (error) {
      console.error(error)
    }
  })

  it('API + Admin', async () => {
    const originAppCount = (await adminClient.admin.getApps()).length

    const { message } = await adminClient.api.getGlobalConfig()
    const { id: appId } = await adminClient.admin.createApp({ name: 'APP_' + new Date().toTimeString() })

    // test app api
    const APP_NAME = 'test_game' + new Date().toTimeString()
    const apps = await adminClient.admin.getApps()
    assert.equal(apps.length, originAppCount + 1)
    await adminClient.admin.updateApp(appId, { name: APP_NAME })
    const app = await adminClient.admin.getApp(appId)
    assert.equal(app.name, APP_NAME)

    // test user api
    const keypair = Keypair.generate()
    const messageBytes = decodeUTF8(message)
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
    const { token } = await adminClient.api.loginSolana({
      appId,
      solAddress: keypair.publicKey.toBase58(),
      signature: encodeBase58(signature),
    })
    const users = await adminClient.admin.getUsers(appId, { page: 1, limit: 10 })
    assert.equal(users.length, 1)

    // get user profile
    const apiClient = new OpenAuthClient(OPENAUTH_ENDPOINT, token)
    const { id: userId, referCode, solAddress } = await apiClient.api.getUserProfile()
    assert.equal(solAddress, keypair.publicKey.toString())
    assert(referCode !== null)

    // test referral1
    let referCode1: string
    {
      const client = new OpenAuthClient(OPENAUTH_ENDPOINT)
      const keypair = Keypair.generate()
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
      const { token } = await adminClient.api.loginSolana({
        appId,
        solAddress: keypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
      client.updateToken(token)
      await client.api.setReferrer({ referCode })
      const { referCode: code } = await client.api.getUserProfile()
      assert(code !== null)
      referCode1 = code
    }

    // test referral2
    {
      const client = new OpenAuthClient(OPENAUTH_ENDPOINT)
      const keypair = Keypair.generate()
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
      const { token } = await adminClient.api.loginSolana({
        appId,
        solAddress: keypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
      client.updateToken(token)
      await client.api.setReferrer({ referCode: referCode1 })
    }

    // verify referral chain
    const referrals = await apiClient.api.getReferral()
    assert.equal(referrals.refee1Count, 1)
    assert.equal(referrals.refee2Count, 1)
  })
})
