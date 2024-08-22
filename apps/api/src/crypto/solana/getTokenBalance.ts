import type { Connection } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

export async function getTokenBalance(connection: Connection, { tokenMint, walletAddress }: { tokenMint: string | 'SOL', walletAddress: string }): Promise<number> {
  const wallet = new PublicKey(walletAddress)
  if (tokenMint === 'SOL') {
    const balance = await connection.getBalance(wallet)
    return balance / LAMPORTS_PER_SOL
  }

  const response = await connection.getParsedTokenAccountsByOwner(new PublicKey(walletAddress), { mint: new PublicKey(tokenMint) })
  if (response.value.length > 0) {
    const account = response.value[0].account.data.parsed.info
    return account.tokenAmount.uiAmount
  }
  return 0
}
