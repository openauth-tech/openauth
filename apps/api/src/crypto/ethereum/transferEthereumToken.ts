import { createWalletClient, getAddress, http, publicActions } from 'viem'

import { getEthereumTokenBalance } from './getEthereumTokenBalance'
import { getEthereumWallet } from './getEthereumWallet'
import type { EvmChainName } from './types'
import { getEvmChainByName } from './types'

export async function transferEthereumToken({
  chainName,
  tokenAddress: tokenAddressStr,
  toAddress: toAddressStr,
  amount,
  userId,
  rpcUrl,
}: {
  chainName: `${EvmChainName}`
  tokenAddress?: string
  toAddress: string
  amount: bigint
  userId: string
  rpcUrl: string
}) {
  const chain = getEvmChainByName(chainName)
  const { account, walletAddress } = getEthereumWallet(userId)
  const client = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions)

  const tokenAddress = tokenAddressStr ? getAddress(tokenAddressStr) : undefined
  const toAddress = getAddress(toAddressStr)

  const { balance } = await getEthereumTokenBalance({ chainName, walletAddress, rpcUrl, tokenAddress })

  if (balance < amount) {
    throw new Error('Insufficient balance')
  }

  if (!tokenAddress) {
    return await client.sendTransaction({
      account,
      to: toAddress,
      value: amount,
    })
  }

  return await client.writeContract({
    address: tokenAddress,
    abi: [
      {
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'recipient', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
      },
    ],
    functionName: 'transfer',
    args: [toAddress, amount],
  })
}
