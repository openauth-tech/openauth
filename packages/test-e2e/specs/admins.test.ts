import '../setup'
import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from '../constants'
import { OpenAuthClient } from '@open-auth/sdk-core'
import { beforeEach } from 'node:test'
import assert from 'assert'

const api = new OpenAuthClient(OPENAUTH_ENDPOINT)

beforeEach(async () => {
  const { token } = await api.admin.login({
    username: USERNAME,
    password: PASSWORD,
  })

  api.updateToken(token)
})

describe('Admin', () => {
  it('Apps', async () => {
    {
      const apps = await api.admin.getApps()
      assert.equal(apps.length, 0)
    }
    {
      const APP_NAME = 'test_game'
      const app = await api.admin.createApp({ name: APP_NAME })
      const apps = await api.admin.getApps()
    }
    {
      const users = await api.admin.getUsers(1, { page: 1, limit: 10 })
      console.log(users)
    }
  })
})
