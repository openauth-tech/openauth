import CHAINS from 'viem/chains'

export enum EvmChainName {
  mainnet = 'mainnet',
  sepolia = 'sepolia',

  bsc = 'bsc',
  bscTestnet = 'bscTestnet',

  moonbeam = 'moonbeam',
}

export function getEvmChainByName(name: `${EvmChainName}`) {
  return CHAINS[name]
}
