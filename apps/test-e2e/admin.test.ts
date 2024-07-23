import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth Admin API', () => {
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

  it('Admin', async () => {
    const originAppCount = (await client.admin.listApps()).length

    const { id: appId } = await client.admin.createApp({ name: 'init_test_admin_' + new Date().getTime() })

    // test app api
    const APP_NAME = 'test_admin_' + new Date().getTime()
    const apps = await client.admin.listApps()
    assert.equal(apps.length, originAppCount + 1)
    await client.admin.updateApp(appId, { name: APP_NAME })
    const app = await client.admin.getApp(appId)
    assert.equal(app.name, APP_NAME)

    // test secret api
    const { secret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(secret)

    const { data: users } = await client.app.listUsers({ page: 1, limit: 10 })
    assert.equal(users.length, 0)
  })
})
