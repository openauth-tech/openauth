import { OpenAuthHttpClient } from '../../types'

export async function getUsers(client: OpenAuthHttpClient) {
  return await client.get('/admin/users')
}
