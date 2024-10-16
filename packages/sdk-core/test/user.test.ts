import assert from 'node:assert'

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

import { OpenAuthClient } from '../client'
import { OPENAUTH_ENDPOINT } from './lib/constants.ts'
import { bindSolanaUser, getTestApp, logInNewEthereumUser, logInNewSolanaUser, logInUsernameUser, setupAdmin } from './lib/helper.ts'

const client = new OpenAuthClient(OPENAUTH_ENDPOINT)

describe('OpenAuth User API', () => {
  before(() => setupAdmin(client))

  it('Log in with Solana', async () => {
    const { id: appId } = await getTestApp(client)
    const { solAddress } = await logInNewSolanaUser(client, appId)
    const profile = await client.user.getProfile()
    assert.equal(profile.solAddress, solAddress)
  })

  it('Log in with Ethereum', async () => {
    const { id: appId } = await getTestApp(client)
    const { ethAddress } = await logInNewEthereumUser(client, appId)
    const profile = await client.user.getProfile()
    assert.equal(profile.ethAddress, ethAddress)
  })

  it('Log in with Username', async () => {
    const { id: appId } = await getTestApp(client)
    const username = `test_user_${Date.now()}`
    const password = `pass_word_${Date.now()}`
    await logInUsernameUser(client, appId, username, password)
    const profile = await client.user.getProfile()
    assert.equal(profile.username, username)

    // update password
    const newPassword = `${password}_new`
    await client.user.updatePassword({ oldPassword: password, newPassword })
    await client.user.logInWithUsername({ appId, username, password: newPassword, type: 'login' })

    const newProfle = await client.user.getProfile()
    assert.equal(newProfle.username, username)
  })

  it('Bind Solana', async () => {
    const { id: appId } = await getTestApp(client)
    await logInNewEthereumUser(client, appId)
    const solanaKeypair = Keypair.generate()
    await bindSolanaUser(client, appId, solanaKeypair)

    const profile = await client.user.getProfile()
    assert.equal(profile.solAddress, solanaKeypair.publicKey.toBase58())
  })

  it('Wallets', async () => {
    const { id } = await getTestApp(client)
    await logInUsernameUser(client, id)

    const wallets = await client.user.getWallets()
    console.info(wallets.solWallet)
    assert.equal(wallets.solWallet.length, 44)
  })

  it('Send Solana Transaction', async () => {
    const { id } = await getTestApp(client)
    await logInUsernameUser(client, id)

    const { solWallet } = await client.user.getWallets()
    console.info('user solWallet:', solWallet)
    const payer = Keypair.fromSeed(new Uint8Array(Buffer.from(`${solWallet.slice(0, 31)}0`)))
    console.info('payer wallet:', payer.publicKey.toBase58())
    const target = Keypair.fromSeed(new Uint8Array(Buffer.from(`${solWallet.slice(0, 31)}1`)))
    console.info('target wallet:', target.publicKey.toBase58())

    {
      const { signature } = await client.user.sendSolanaToken({
        rpcUrl: 'https://devnet.sonic.game',
        address: target.publicKey.toBase58(),
        token: 'SOL',
        amount: '1234000',
      })
      console.info('transfer SOL signature', signature)
      assert(signature.length > 0)
    }
    {
      const { signature } = await client.user.sendSolanaToken({
        rpcUrl: 'https://devnet.sonic.game',
        address: target.publicKey.toBase58(),
        token: 'DUccEanNeePrPaVkMf5PBQSJ62UnHoWt49y3uWhhGBeD',
        amount: '12340000000',
      })
      console.info('transfer TOKEN signature', signature)
      assert(signature.length > 0)
    }
    {
      const connection = new Connection('https://devnet.sonic.game')
      const { blockhash } = await connection.getLatestBlockhash()

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solWallet),
          toPubkey: target.publicKey,
          lamports: 0.00123 * LAMPORTS_PER_SOL,
        }),
      )
      transaction.recentBlockhash = blockhash
      transaction.feePayer = payer.publicKey
      transaction.partialSign(payer)

      const serializedTransaction = transaction.serialize({ requireAllSignatures: false })
      const encodedTransaction = serializedTransaction.toString('base64')

      const { signature } = await client.user.signSolanaTransaction({
        rpcUrl: 'https://devnet.sonic.game',
        transaction: encodedTransaction,
      })
      console.info('sign Solana signature', signature)
      assert(signature.length > 0)
    }
  })
})
