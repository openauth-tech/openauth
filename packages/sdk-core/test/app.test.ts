import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import { OpenAuthClient } from '../client'
import { getTestApp, setupAdmin } from './lib/helper.ts'
import assert from 'assert'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth App API', () => {
  before(() => setupAdmin(client))

  it('App', async () => {
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
  })
})
