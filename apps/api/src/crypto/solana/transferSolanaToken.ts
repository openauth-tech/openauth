import { createTransferInstruction, getMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import type { Connection } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js'

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
  amount: number
  token: string | 'SOL'
}) {
  const { keypair } = getSolanaWallet(userId)
  const fromPubkey = keypair.publicKey
  const toPubkey = new PublicKey(address)

  const transaction = new Transaction()
  if (token === 'SOL') {
    const lamports = amount * LAMPORTS_PER_SOL
    transaction.add(SystemProgram.transfer({ fromPubkey, toPubkey, lamports }))
  } else {
    const mint = new PublicKey(token)
    const mintInfo = await getMint(connection, mint)
    const lamports = amount * 10 ** mintInfo.decimals
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, fromPubkey)
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, toPubkey)
    transaction.add(createTransferInstruction(fromTokenAccount.address, toTokenAccount.address, fromPubkey, lamports))
  }

  return await sendAndConfirmTransaction(connection, transaction, [keypair], { commitment: 'processed' })
}
