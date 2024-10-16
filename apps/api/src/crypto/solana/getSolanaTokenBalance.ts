import type { Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

type Params = {
  connection: Connection
  tokenMint: string | 'SOL'
  walletAddress: string
}

export async function getSolanaTokenBalance({ connection, tokenMint, walletAddress }: Params): Promise<bigint> {
  const wallet = new PublicKey(walletAddress)
  if (tokenMint === 'SOL') {
    const balance = await connection.getBalance(wallet)
    return BigInt(balance)
  }

  const response = await connection.getParsedTokenAccountsByOwner(new PublicKey(walletAddress), { mint: new PublicKey(tokenMint) })
  if (response.value.length > 0) {
    const account = response.value[0].account.data.parsed.info
    return BigInt(account.tokenAmount.amount as string)
  }
  return 0n
}
