import { api, buildHttpClient } from '@openauth-tech/sdk-core'
import { OPENAUTH_ENDPOINT, PASSWORD, USERNAME } from './constants'

beforeEach(async () => {
  // TODO: clean up database
  const client = buildHttpClient(OPENAUTH_ENDPOINT)
  try {
    await api.admin.setup(client, { username: USERNAME, password: PASSWORD })
  } catch (error) {}
})

afterEach(async () => {})
