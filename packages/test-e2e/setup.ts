import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'
import { OpenAuthClient } from '@open-auth/sdk-core'

beforeEach(async () => {
  // TODO: clean up database
  const client = new OpenAuthClient(OPENAUTH_ENDPOINT)
  try {
    await client.admin.setup({ username: USERNAME, password: PASSWORD })
  } catch (error) {}
})

afterEach(async () => {})
