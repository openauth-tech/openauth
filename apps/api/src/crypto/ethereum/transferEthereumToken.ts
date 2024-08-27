import { createWalletClient, http, parseEther, parseUnits, publicActions } from 'viem'
import { bsc, mainnet, sepolia } from 'viem/chains'

import { getEthereumTokenBalance } from './getEthereumTokenBalance'
import { getEthereumWallet } from './getEthereumWallet'

export async function transferEthereumToken({
  chainName,
  tokenAddress,
  toAddress,
  amount,
  userId,
  rpcUrl,
}: {
  chainName: 'sepolia' | 'mainnet' | 'bsc'
  tokenAddress: `0x${string}` | 'ETH'
  toAddress: `0x${string}`
  amount: number
  userId: string
  rpcUrl: string
}) {
  const chain = { sepolia, mainnet, bsc }[chainName]
  const { account, walletAddress } = getEthereumWallet(userId)
  const client = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions)

  const { decimals, balance } = await getEthereumTokenBalance({ chainName, walletAddress, rpcUrl, tokenAddress })
  const amountBI = parseUnits(amount.toString(), decimals)

  if (balance < amountBI) {
    throw new Error('Insufficient balance')
  }

  if (tokenAddress === 'ETH') {
    return await client.sendTransaction({
      account,
      to: toAddress,
      value: parseEther(amount.toString()),
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
    args: [toAddress, parseUnits(amount.toString(), decimals)],
  })
}
