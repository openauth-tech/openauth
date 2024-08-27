import { GearApi } from '@gear-js/api'

import { getVaraWallet } from './getVaraWallet'

export async function sendVaraReply({
  userId,
  payload,
  replyToId,
}: {
  userId: string
  payload: string
  replyToId: `0x${string}`
}) {
  const { keypair } = await getVaraWallet(userId)

  const api = await GearApi.create()
  const extrinsic = await api.message.sendReply({
    replyToId,
    payload,
    gasLimit: 10000000,
    value: 1000,
  })
  const result = await extrinsic.signAndSend(keypair)
  return result.toHex()
}
