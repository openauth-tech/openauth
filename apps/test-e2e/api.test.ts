import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import { decodeUTF8 } from 'tweetnacl-util'
import nacl from 'tweetnacl'
import { encodeBase58 } from 'ethers'
import { newUserAndLogin } from "./helper";

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
    const { id: appId } = await adminClient.admin.createApp({ name: 'test_api_' + new Date().getTime() })
    const { message } = await adminClient.api.getGlobalConfig(appId)

    // login solana
    const keypair = Keypair.generate()
    const messageBytes = decodeUTF8(message)
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
    const { token } = await adminClient.api.loginSolana({
      appId,
      solAddress: keypair.publicKey.toBase58(),
      signature: encodeBase58(signature),
    })
    const { data: users } = await adminClient.admin.getUsers(appId, { page: 1, limit: 10 })
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
      await client.api.bindReferrer({ referCode })
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
      await client.api.bindReferrer({ referCode: referCode1 })
    }

    // verify referral chain
    const referrals = await adminClient.admin.getUserReferral(appId, userId)
    assert.equal(referrals.referrals1.length, 1)
    assert.equal(referrals.referrals2.length, 1)
  })

  it('Solana bundle to 2 apps', async () => {
    const solanaKeypair = Keypair.generate()

    {
      const { id: appId } = await adminClient.admin.createApp({ name: 'test_app1_' + new Date().getTime() })
      await newUserAndLogin(adminClient, appId)

      const { message } = await adminClient.api.getGlobalConfig(appId)
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, solanaKeypair.secretKey)
      const { id: userId } = await adminClient.api.bindSolana({
        appId,
        solAddress: solanaKeypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
      assert(userId)
    }

    {
      const { id: appId } = await adminClient.admin.createApp({ name: 'test_app2_' + new Date().getTime() })
      await newUserAndLogin(adminClient, appId)

      const { message } = await adminClient.api.getGlobalConfig(appId)
      const messageBytes = decodeUTF8(message)
      const signature = nacl.sign.detached(messageBytes, solanaKeypair.secretKey)
      const { id: userId } = await adminClient.api.bindSolana({
        appId,
        solAddress: solanaKeypair.publicKey.toBase58(),
        signature: encodeBase58(signature),
      })
      assert(userId)
    }
  })
})
