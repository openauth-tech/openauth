import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import base58 from 'bs58'
import axios from 'axios'
import { createHmac } from 'node:crypto'

export const SALT_ROUNDS = 10

export function getMessageText(name: string) {
  return `By signing, you are proving you own this wallet and logging in ${name}.`
}

export function verifyETH(appName: string, wallet: string, sig: string) {
  try {
    const messageText = getMessageText(appName)
    const address_returned = ethers.verifyMessage(messageText, sig)
    return wallet.toLowerCase() === address_returned.toLowerCase()
  } catch (e) {
    console.error(e)
    return false
  }
}

export function verifySOL(appName: string, wallet: string, sig: string) {
  try {
    const messageText = getMessageText(appName)
    const messageBytes = new TextEncoder().encode(messageText)
    return nacl.sign.detached.verify(messageBytes, base58.decode(sig), base58.decode(wallet))
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function verifyGoogle(email: string, token: string) {
  try {
    const data = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { verified: data.data?.email.toLowerCase() === email.toLowerCase(), avatar: data.data?.picture }
  } catch (e) {
    console.error(e)
    return { verified: false }
  }
}

export async function verifyDiscord(id: string, token: string) {
  try {
    const data = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return {
      verified: data.data?.id === id,
      avatar: data.data?.avatar
        ? `https://cdn.discordapp.com/avatars/${data.data.id}/${data.data.avatar}.png`
        : undefined,
    }
  } catch (e) {
    console.error(e)
    return { verified: false }
  }
}

export function parseTelegramData(initData: string) {
  const data = new URLSearchParams(initData)
  const user = JSON.parse(data.get('user') ?? '{}')
  return {
    userId: user.id as number,
    username: user.username as string,
    firstName: user.first_name as string,
    lastName: user.last_name as string,
    languageCode: user.language_code as string,
  }
}

export function verifyTelegram(initData: string, botToken: string) {
  if (!botToken || !initData) {
    return false
  }
  const data = new URLSearchParams(initData)
  const data_check_string = getCheckString(data)
  const secret_key = HMAC_SHA256('WebAppData', botToken).digest()
  const hash = HMAC_SHA256(secret_key, data_check_string).digest('hex')
  return hash === data.get('hash')
}

function HMAC_SHA256(key: string | Buffer, secret: string) {
  return createHmac('sha256', key).update(secret)
}

function getCheckString(data: URLSearchParams) {
  const items: [k: string, v: string][] = []
  for (const [k, v] of data.entries()) if (k !== 'hash') items.push([k, v])
  return items
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')
}
