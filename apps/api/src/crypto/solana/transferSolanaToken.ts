import { createAssociatedTokenAccountIdempotentInstruction, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import type { Connection } from '@solana/web3.js'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

import { getSolanaTokenBalance } from './getSolanaTokenBalance'
import { getSolanaWallet } from './getSolanaWallet'

export async function transferSolanaToken({
  connection,
  userId,
  address,
  amount,
  token,
}: {
  connection: Connection
  userId: string
  address: string
  amount: bigint
  token: string | 'SOL'
}) {
  const { keypair } = getSolanaWallet(userId)
  const fromPubkey = keypair.publicKey
  const toPubkey = new PublicKey(address)

  const balance = await getSolanaTokenBalance({ connection, tokenMint: token, walletAddress: fromPubkey.toBase58() })
  if (balance < amount) {
    throw new Error('Insufficient balance')
  }

  const transaction = new Transaction()
  if (token === 'SOL') {
    transaction.add(SystemProgram.transfer({ fromPubkey, toPubkey, lamports: amount }))
  } else {
    const mint = new PublicKey(token)
    const fromTokenAccount = await getAssociatedTokenAddress(mint, fromPubkey, true)
    const toTokenAccount = await getAssociatedTokenAddress(mint, toPubkey, true)

    transaction.add(createAssociatedTokenAccountIdempotentInstruction(keypair.publicKey, toTokenAccount, toPubkey, mint))
    transaction.add(createTransferInstruction(fromTokenAccount, toTokenAccount, fromPubkey, amount))
  }

  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.sign(keypair)

  const serialized = transaction.serialize()
  return await connection.sendRawTransaction(serialized)
}
