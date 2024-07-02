import { buildHttpClient, api } from '@openauth-tech/sdk-core'
import assert from 'assert'
import '../setup'
import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from '../constants'

describe('Admin', () => {
  describe('User', () => {
    it('Get users list ', async () => {
      let client = buildHttpClient(OPENAUTH_ENDPOINT)

      const { token } = await api.admin.login(client, {
        username: USERNAME,
        password: PASSWORD,
      })

      client = buildHttpClient(OPENAUTH_ENDPOINT, token)

      const users = await api.admin.getUsers(client, { appId: '1', page: 1, limit: 10 })
      console.log(users)
      assert.equal([1, 2, 3].indexOf(2), -1)
    })
  })
})
