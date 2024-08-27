import crypto from 'node:crypto'

import { GearKeyring } from '@gear-js/api'

import { WALLET_SEED_SALT } from '../../constants'

export async function getVaraWallet(userId: string) {
  const seedStr = `${WALLET_SEED_SALT}_${userId}`
  const hash = crypto.createHash('sha256')
  hash.update(Buffer.from(seedStr))
  const seed = hash.digest()

  const keyringPair = await GearKeyring.fromSeed(seed)

  return {
    keyringPair,
    walletAddress: keyringPair.address,
    keyringJson: keyringPair.toJson(),
  }
}
