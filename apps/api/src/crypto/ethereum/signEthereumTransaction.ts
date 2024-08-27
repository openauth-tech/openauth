import type { Connection } from '@solana/web3.js'

export async function signEthereumTransaction({
  connection,
  userId,
  encodedTransaction,
}: {
  connection: Connection
  userId: string
  encodedTransaction: string
}) {}
