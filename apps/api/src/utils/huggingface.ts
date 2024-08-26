import axios from 'axios'

import type { HuggingfaceCodeParams, HuggingfaceToken, HuggingfaceTokenQueryParams, HuggingfaceUser } from '../models/huggingface'

export enum HuggingfaceCookieNames {
  AppId = 'OpenAuthAppId',
  RedirectUri = 'OpenAuthRedirectUri',
  RedirectUrl = 'OpenAuthRedirectUrl',
}

export function generateAuthUrl({ clientId, scopes = ['openid', 'profile'], redirectUri }: HuggingfaceCodeParams) {
  const searchParams = new URLSearchParams()
  const csrfState = Math.random().toString(36).slice(2)

  searchParams.append('response_type', 'code')
  searchParams.append('redirect_uri', redirectUri)
  searchParams.append('scope', scopes.join(' '))
  searchParams.append('client_id', clientId)
  searchParams.append('state', csrfState)

  return `https://huggingface.co/oauth/authorize/?${searchParams.toString()}`
}

export async function getAccessToken(params: HuggingfaceTokenQueryParams) {
  const { code, client_id, client_secret, redirect_uri } = params
  const credentials = `${client_id}:${client_secret}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')

  try {
    const data = await axios.post<HuggingfaceToken>('https://huggingface.co/oauth/token', {
      code,
      client_id,
      grant_type: 'authorization_code',
      redirect_uri,
    }, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    })
    return data.data
  } catch (e: any) {
    console.error(e)
    throw new Error('Failed to get huggingface access_token.')
  }
}

export async function getHuggingfaceUser(token: string, tokenType?: string) {
  try {
    const data = await axios.get<HuggingfaceUser>('https://huggingface.co/api/whoami-v2', {
      headers: {
        Authorization: `${tokenType ?? 'Bearer'} ${token}`,
      },
    })
    return data.data
  } catch (e) {
    console.error(e)
    throw new Error('Failed to get huggingface user info.')
  }
}
