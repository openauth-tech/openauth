import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'
import { Keypair } from '@solana/web3.js'
import { decodeUTF8 } from 'tweetnacl-util'
import nacl from 'tweetnacl'
import { encodeBase58 } from 'ethers'

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
      client.updateToken(token)
    } catch (error) {
      console.error(error)
    }
  })

  it('API + Admin', async () => {
    const originAppCount = (await client.admin.getApps()).length

    const { message } = await client.api.getGlobalConfig()
    const { id: appId } = await client.admin.createApp({ name: 'APP_' + new Date().toTimeString() })

    // test app api
    const APP_NAME = 'test_game' + new Date().toTimeString()
    const apps = await client.admin.getApps()
    assert.equal(apps.length, originAppCount + 1)
    await client.admin.updateApp(appId, { name: APP_NAME })
    const app = await client.admin.getApp(appId)
    assert.equal(app.name, APP_NAME)

    // test user api
    const keypair = Keypair.generate()
    const messageBytes = decodeUTF8(message)
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
    const { token } = await client.api.loginSolana({
      appId,
      solAddress: keypair.publicKey.toBase58(),
      signature: encodeBase58(signature),
    })
    const users = await client.admin.getUsers(appId, { page: 1, limit: 10 })
    assert.equal(users.length, 1)

    const apiClient = new OpenAuthClient(OPENAUTH_ENDPOINT, token)
    const { solAddress } = await apiClient.api.getUserProfile()
    assert.equal(solAddress, keypair.publicKey.toString())
  })
})
