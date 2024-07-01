import { OpenAuthHttpClient } from '../../types'

export async function setup(
  client: OpenAuthHttpClient,
  data: {
    username: string
    password: string
  }
) {
  return await client.post('/admin/setup', data)
}

export async function login(
  client: OpenAuthHttpClient,
  data: {
    username: string
    password: string
  }
) {
  return (await client.post<{ token: string }>('/admin/login', data)).data
}

export * from './user'
