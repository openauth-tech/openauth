import axios from 'axios'
import base58 from 'bs58'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import { decodeUTF8 } from 'tweetnacl-util'
import { getMessageText } from '../constants/common'
import { JwtPayload } from '../models/request'
import { generateRandomString } from './common'
import { redis } from './redis'

export const SALT_ROUNDS = 10

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
    const messageBytes = decodeUTF8(messageText)
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
    return data.data?.email.toLowerCase() === email.toLowerCase()
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function checkSessionId(sessionId: string, jwtExpireSeconds: number) {
  if (await redis.exists(sessionId)) {
    await redis.set(sessionId, '', 'EX', jwtExpireSeconds)
    return true
  }
  return false
}

export async function generateSessionId(jwtExpireSeconds: number) {
  if (jwtExpireSeconds > 0) {
    const sessionId = generateRandomString(20)
    await redis.set(sessionId, '', 'EX', jwtExpireSeconds)
    return sessionId
  }
}

export async function createJwtPayload(userId: string, appId: string, jwtExpireSeconds: number) {
  const payload: JwtPayload = { userId, appId }

  if (jwtExpireSeconds > 0) {
    payload.sessionId = await generateSessionId(jwtExpireSeconds)
  }

  return payload
}
