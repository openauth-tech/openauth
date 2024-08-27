import type { Connection } from '@solana/web3.js'

export async function signPolkadotTransaction({
  connection,
  userId,
  encodedTransaction,
}: {
  connection: Connection
  userId: string
  encodedTransaction: string
}) {}
