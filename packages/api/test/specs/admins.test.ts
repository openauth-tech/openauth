import { buildHttpClient, getUsers } from '@openauth-tech/sdk-core'
import assert from 'assert'

describe('Admin', () => {
  describe('User', () => {
    it('Get users list ', async () => {
      const client = buildHttpClient('http://localhost:5565')
      const users = await getUsers(client)
      console.log(users)
      assert.equal([1, 2, 3].indexOf(2), -1)
    })
  })
})
