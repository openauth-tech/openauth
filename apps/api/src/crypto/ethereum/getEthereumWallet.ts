import crypto from 'node:crypto'

import { u8aToHex } from '@polkadot/util'
import { privateKeyToAccount } from 'viem/accounts'

import { WALLET_SEED_SALT } from '../../constants'

export function getEthereumWallet(userId: string) {
  const seedStr = `${WALLET_SEED_SALT}_${userId}`
  const privateKeyHash = crypto.createHash('sha256').update(Buffer.from(seedStr)).digest()
  const privateKey = u8aToHex(privateKeyHash)
  const account = privateKeyToAccount(privateKey)

  return {
    account,
    walletAddress: account.address,
    privateKey,
  }
}
