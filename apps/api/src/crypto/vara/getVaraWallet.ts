import crypto from 'node:crypto'

import { GearKeyring } from '@gear-js/api'

import { WALLET_SEED_SALT } from '../../constants'

export async function getVaraWallet(userId: string) {
  const seedStr = `${WALLET_SEED_SALT}_${userId}`
  const hash = crypto.createHash('sha256')
  hash.update(Buffer.from(seedStr))
  const seed = hash.digest()

  const keypair = await GearKeyring.fromSeed(seed)

  return {
    keypair,
    walletAddress: keypair.address,
    keypairJson: keypair.toJson(),
  }
}
