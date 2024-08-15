import { Connection } from '@solana/web3.js'

export enum SolanaNetwork {
  SolanaMainnet = 'SolanaMainnet',
  SonicDevnet = 'SonicDevnet',
}

export const getConnection = function (network: SolanaNetwork, rpcUrl?: string): Connection {
  if (rpcUrl) {
    return new Connection(rpcUrl)
  }
  switch (network) {
    case SolanaNetwork.SolanaMainnet: {
      return new Connection('https://api.mainnet-beta.solana.com')
    }
    case SolanaNetwork.SonicDevnet: {
      return new Connection('https://devnet.sonic.game')
    }
    default: {
      throw new Error('Invalid network')
    }
  }
}
