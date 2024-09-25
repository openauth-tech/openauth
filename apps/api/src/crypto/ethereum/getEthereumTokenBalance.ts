import { createPublicClient, erc20Abi, formatEther, formatUnits, http, publicActions } from 'viem'

import type { EvmChainName } from './types'
import { getEvmChainByName } from './types'

export async function getEthereumTokenBalance({
  chainName,
  tokenAddress,
  walletAddress,
  rpcUrl,
}: {
  chainName: `${EvmChainName}`
  tokenAddress?: `0x${string}`
  walletAddress: `0x${string}`
  rpcUrl: string
}) {
  const chain = getEvmChainByName(chainName)

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions)

  if (!tokenAddress) {
    const balance = await client.getBalance({ address: walletAddress })

    return {
      uiBalance: Number.parseFloat(formatEther(balance)),
      balance,
      decimals: 18,
    }
  }

  const decimals = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [walletAddress],
  })

  return {
    uiBalance: Number.parseFloat(formatUnits(balance, decimals)),
    balance,
    decimals,
  }
}
