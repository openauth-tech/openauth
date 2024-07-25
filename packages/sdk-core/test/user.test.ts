import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import { bindSolanaUser, logInNewEthereumUser, logInNewSolanaUser, setupAdmin } from './lib/helper.ts'
import { OpenAuthClient } from '../client'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth User API', () => {
  before(() => setupAdmin(client))

  it('API + Admin', async () => {
    const { id: appId } = await client.admin.createApp({ name: 'test_api_' + new Date().getTime() })
    const { secret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(secret)

    // login solana
    const { solAddress } = await logInNewSolanaUser(client, appId)
    const { data: users } = await client.app.listUsers({ page: 1, limit: 10 })
    assert.equal(users.length, 1)

    // get user profile
    const { id: userId, referCode, solAddress: solAddressInProfile } = await client.user.getProfile()
    assert.equal(solAddressInProfile, solAddress)
    assert(referCode !== null)

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

  it('Solana bundle to 2 apps', async () => {
    const solanaKeypair = Keypair.generate()

    {
      const { id: appId } = await client.admin.createApp({ name: 'test_app1_' + new Date().getTime() })
      await logInNewEthereumUser(client, appId)
      await bindSolanaUser(client, appId, solanaKeypair)
    }

    {
      const { id: appId } = await client.admin.createApp({ name: 'test_app2_' + new Date().getTime() })
      await logInNewEthereumUser(client, appId)
      await bindSolanaUser(client, appId, solanaKeypair)
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
    const { token } = await client.user.logInWithUsername({
      appId,
      username: userData.username,
      password: userData.password,
    })
    assert(token)

    // update password
    client.user.updateToken(token)
    await client.user.updatePassword({ oldPassword: '123456', newPassword: '234567' })
    const { token: token2 } = await client.user.logInWithUsername({
      appId,
      username: userData.username,
      password: '234567',
    })
    assert(token2)
  })
})
