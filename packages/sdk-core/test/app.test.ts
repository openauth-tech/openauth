import assert from 'node:assert'

import { ethers } from 'ethers'

import { OpenAuthClient } from '../client'
import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import { getTestApp, logInNewSolanaUser, logInUsernameUser, setupAdmin } from './lib/helper.ts'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth App API', () => {
  before(() => setupAdmin(client))

  it('User list wallet profile', async () => {
    // init app
    const app = await getTestApp(client)
    const { appSecret } = await client.admin.getAppSecret(app.id)
    client.app.updateToken(appSecret)

    // user
    for (let i = 0; i < 15; i += 1) {
      await client.app.createUser({ telegram: `${Date.now()}${i}` })
    }

    // list user
    {
      const { data, meta } = await client.app.listUsers({ page: 1, limit: 10 })
      assert.equal(data.length, 10)
      assert(meta.totalItems > 10)
      assert(meta.totalPages >= 1)
      const { data: data2 } = await client.app.listUsers({ page: 1, limit: 2 })
      assert.equal(data2.length, 2)
      const data0 = await client.app.searchUsers({ ids: [] })
      assert.equal(data0.length, 0)
      const data1 = await client.app.searchUsers({ ids: [data[0].id] })
      assert.equal(data1.length, 1)
    }

    {
      const { data } = await client.app.listUsers({ page: 1, limit: 1 })

      // profile
      const user = data[0]
      const userDetail = await client.app.getUser(user.id)
      assert.equal(userDetail.id, user.id)

      // wallet
      const wallets = await client.app.getUserWallets(user.id)
      assert(wallets.solWallet.length > 0)
    }
  })

  it('Referral', async () => {
    const { id: appId } = await getTestApp(client)
    const { appSecret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(appSecret)

    // login solana
    await logInNewSolanaUser(client, appId)
    const { id: userId, referCode } = await client.user.getProfile()

    // test referral1
    let referCode1: string
    let userId1: string
    {
      await logInNewSolanaUser(client, appId)
      const { referCode: code, id } = await client.user.getProfile()
      assert(code !== null)
      referCode1 = code
      userId1 = id
      await client.app.setUserReferrer(id, { referCode })
    }

    // test referral2
    {
      await logInNewSolanaUser(client, appId)
      const { id } = await client.user.getProfile()
      await client.app.setUserReferrer(id, { referCode: referCode1 })

      const referral = await client.app.getUserReferral(id)
      assert.deepEqual(referral.referralChain, [id, userId1, userId])
    }

    // verify referral chain
    const referrals = await client.app.getUserReferral(userId)
    assert.equal(referrals.referrals1.length, 1)
    assert.equal(referrals.referrals2.length, 1)
  })

  it('Send Ethereum Transaction', async () => {
    const { id: appId } = await getTestApp(client)
    const { appSecret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(appSecret)

    const target = ethers.Wallet.createRandom()
    await logInUsernameUser(client, appId)

    const { id } = await client.user.getProfile()
    const { ethWallet } = await client.user.getWallets()
    console.info('user ethWallet:', ethWallet)
    console.info('target wallet:', target.address)

    {
      const { signature } = await client.app.sendEthereumToken(id, {
        chainName: 'sepolia',
        rpcUrl: 'https://rpc.sepolia.org',
        toAddress: target.address,
        amount: '1234000000000000', // 0.001234
      })
      console.info('transfer ETH signature', signature)
      assert(signature.length > 0)
    }
    {
      const { signature } = await client.app.sendEthereumToken(id, {
        chainName: 'sepolia',
        rpcUrl: 'https://rpc.sepolia.org',
        toAddress: target.address,
        amount: '12340000000000000000', // 12.34
        tokenAddress: '0x520A3474beAaE4AC406242aa74eF6D052dE8aaED',
      })
      console.info('transfer TOKEN signature', signature)
      assert(signature.length > 0)
    }
  })
})
