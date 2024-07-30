import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import { OpenAuthClient } from '../client'
import { getTestApp, logInNewSolanaUser, setupAdmin } from './lib/helper.ts'
import assert from 'assert'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth App API', () => {
  before(() => setupAdmin(client))

  it('User wallet profile', async () => {
    // init app
    const app = await getTestApp(client)
    const { secret } = await client.admin.getAppSecret(app.id)
    client.app.updateToken(secret)

    // user
    for (let i = 0; i < 15; i++) {
      await client.app.createUser({ username: `test_user_${i}_${Date.now()}`, password: `password_${i}` })
    }
    const { data, meta } = await client.app.listUsers({ page: 1, limit: 10 })
    assert.equal(data.length, 10)
    assert(meta.totalItems > 10)
    assert(meta.totalPages >= 1)

    const user = data[0]
    const userDetail = await client.app.getUser(user.id)
    assert.equal(userDetail.id, user.id)

    // wallet
    const wallets = await client.app.getWallets(user.id)
    assert(wallets.solWallet.length > 0)
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
      const { referCode: code, id } = await client.user.getProfile()
      assert(code !== null)
      referCode1 = code
      await client.app.setReferrer(id, { referCode })
    }

    // test referral2
    {
      await logInNewSolanaUser(client, appId)
      const { id } = await client.user.getProfile()
      await client.app.setReferrer(id, { referCode: referCode1 })
    }

    // verify referral chain
    const referrals = await client.app.getUserReferral(userId)
    assert.equal(referrals.referrals1.length, 1)
    assert.equal(referrals.referrals2.length, 1)
  })
})
