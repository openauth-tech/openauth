import { base, baseSepolia, bsc, bscTestnet, mainnet, moonbeam, sepolia } from 'viem/chains'

export enum EvmChainName {
  mainnet = 'mainnet',
  sepolia = 'sepolia',

  bsc = 'bsc',
  bscTestnet = 'bscTestnet',

  base = 'base',
  baseSepolia = 'baseSepolia',

  moonbeam = 'moonbeam',
}

export function getEvmChainByName(name: `${EvmChainName}`) {
  return {
    mainnet,
    sepolia,
    bsc,
    bscTestnet,
    base,
    baseSepolia,
    moonbeam,
  }[name]
}
