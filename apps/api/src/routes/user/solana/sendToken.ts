import { Type } from '@fastify/type-provider-typebox'
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import { LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js'
import type { FastifyInstance } from 'fastify'

import { ERROR400_SCHEMA } from '../../../constants/schema'
import { getSolanaWallet } from '../../../crypto/solana/getSolanaWallet'
import { verifyUser } from '../../../handlers/verifyUser'
import type { JwtPayload } from '../../../models/request'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../models/typebox'
import { prisma } from '../../../utils/prisma'
import { getConnection, SolanaNetwork } from '../../../utils/solana'

const schema = {
  tags: ['User'],
  summary: 'Send Solana token',
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  body: Type.Object({
    network: Type.Enum(SolanaNetwork),
    rpcUrl: Type.Optional(Type.String()),
    address: Type.String(),
    token: Type.String(),
    amount: Type.Number(),
  }),
  response: {
    200: Type.Object({
      data: Type.Object({
        signature: Type.String(),
      }),
    }),
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { userId } = request.user as JwtPayload
  const { network, token, amount, address, rpcUrl } = request.body
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const { keypair } = getSolanaWallet(userId)
  const connection = getConnection(network, rpcUrl)
  const fromPubkey = keypair.publicKey
  const toPubkey = new PublicKey(address)
  const lamports = amount * LAMPORTS_PER_SOL

  const transaction = new Transaction()
  if (token === 'SOL') {
    transaction.add(SystemProgram.transfer({ fromPubkey, toPubkey, lamports }))
  } else {
    const mint = new PublicKey(token)
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, fromPubkey)
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, toPubkey)
    transaction.add(createTransferInstruction(fromTokenAccount.address, toTokenAccount.address, fromPubkey, lamports))
  }

  const signature = await sendAndConfirmTransaction(connection, transaction, [keypair], { commitment: 'processed' })

  reply.status(200).send({ data: { signature } })
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/send-token',
    onRequest: [verifyUser],
    schema,
    handler,
  })
}
