import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import { decodeUTF8 } from 'tweetnacl-util'
import nacl from 'tweetnacl'
import { encodeBase58 } from 'ethers'

const adminClient = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth Admin API', () => {
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

  it('Admin', async () => {
    const originAppCount = (await adminClient.admin.getApps()).length

    const { id: appId } = await adminClient.admin.createApp({ name: 'init_test_admin_' + new Date().getTime() })

    // test app api
    const APP_NAME = 'test_admin_' + new Date().getTime()
    const apps = await adminClient.admin.getApps()
    assert.equal(apps.length, originAppCount + 1)
    await adminClient.admin.updateApp(appId, { name: APP_NAME })
    const app = await adminClient.admin.getApp(appId)
    assert.equal(app.name, APP_NAME)

    // test secret api
    const { secret } = await adminClient.admin.getSecret(appId)
    const secretClient = new OpenAuthClient(OPENAUTH_ENDPOINT)
    secretClient.updateToken(secret)

    const users = await secretClient.admin.getUsers(appId, { page: 1, limit: 10 })
    assert.equal(users.length, 0)
  })
})
