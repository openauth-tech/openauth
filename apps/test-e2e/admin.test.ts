import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import assert from 'assert'

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

    const { data: users } = await secretClient.admin.getUsers(appId, { page: 1, limit: 10 })
    assert.equal(users.length, 0)
  })

  it('Token should invaid after user is deleted', async () => {
    const username = 'admin2_' + new Date().getTime()
    const { id: admin2Id } = await adminClient.admin.createAdmin({ username: username, password: 'admin' })
    assert(admin2Id)

    const { token } = await adminClient.admin.login({ username: username, password: 'admin' })

    const admin2Client = new OpenAuthClient(OPENAUTH_ENDPOINT)
    admin2Client.updateToken(token)

    const apps = await admin2Client.admin.getApps()
    assert(apps.length > 1)

    // delete admin
    await adminClient.admin.deleteAdmin(admin2Id.toString())

    const { message } = await admin2Client.admin.getApps() as any
    assert.equal(message, 'Unauthorized')
  })
})
