import { ethers } from 'ethers'
import { decodeUTF8 } from 'tweetnacl-util'
import nacl from 'tweetnacl'
import base58 from 'bs58'
import axios from 'axios'
import { MESSAGE_TEXT } from '../constants/common'

export const SALT_ROUNDS = 10

export function verifyETH(wallet: string, sig: string) {
  try {
    const address_returned = ethers.verifyMessage(MESSAGE_TEXT, sig)
    return wallet.toLowerCase() === address_returned.toLowerCase()
  } catch (e) {
    console.error(e)
    return false
  }
}

export function verifySOL(wallet: string, sig: string) {
  try {
    const messageBytes = decodeUTF8(MESSAGE_TEXT)
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
