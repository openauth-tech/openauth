import { api, buildHttpClient } from '@open-auth/sdk-core'
import assert from 'assert'
import '../setup'
import { OPENAUTH_ENDPOINT } from '../constants'

describe('Config', () => {
  it('', async () => {
    const client = buildHttpClient(OPENAUTH_ENDPOINT)

    const { initialized } = await api.config.getAdminConfig(client)

    const { brand, message, production } = await api.config.getGlobalConfig(client)
    assert(brand?.length > 0)
    assert(message?.length > 0)
    assert(production)
  })
})
