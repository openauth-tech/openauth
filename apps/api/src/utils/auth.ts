import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import base58 from 'bs58'
import axios from 'axios'

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
    return data.data?.email.toLowerCase() === email.toLowerCase()
  } catch (e) {
    console.error(e)
    return false
  }
}
