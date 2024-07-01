import { OpenAuthHttpClient } from '../../types'

export async function getUsers(
  client: OpenAuthHttpClient,
  { appId, page, limit }: { appId: string; page: number; limit: number }
) {
  const queryStr = new URLSearchParams({ appId, page: page.toString(), limit: limit.toString() }).toString()
  return await client.get('/admin/users?' + queryStr)
}
