import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import assert from 'assert'
import { setupAdmin } from './lib/helper.ts'
import { OpenAuthClient } from '../client'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth Admin API', () => {
  before(() => setupAdmin(client))

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
    const { appSecret } = await client.admin.getAppSecret(appId)
    client.app.updateToken(appSecret)

    const { data: users } = await client.app.listUsers({ page: 1, limit: 10 })
    assert.equal(users.length, 0)
  })
})
