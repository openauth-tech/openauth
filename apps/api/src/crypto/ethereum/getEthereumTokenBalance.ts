import { erc20Abi } from 'abitype/abis'
import { createWalletClient, formatEther, formatUnits, http, publicActions } from 'viem'
import { bsc, mainnet, sepolia } from 'viem/chains'

type params = {
  chainName: 'sepolia' | 'mainnet' | 'bsc'
  tokenAddress: `0x${string}` | 'ETH'
  walletAddress: `0x${string}`
  rpcUrl: string
}

export async function getEthereumTokenBalance({ chainName, tokenAddress, walletAddress, rpcUrl }: params) {
  const chain = { sepolia, mainnet, bsc }[chainName]

  const client = createWalletClient({
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions)

  if (tokenAddress === 'ETH') {
    const balance = await client.getBalance({ address: walletAddress })
    return Number.parseFloat(formatEther(balance))
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

  return Number.parseFloat(formatUnits(balance, decimals))
}
