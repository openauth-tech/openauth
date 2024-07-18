import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeUsernameLogin = Type.Object({
  appId: Type.String(),
  username: Type.String(),
  password: Type.String(),
})

export const TypeEthereumLogin = Type.Object({
  appId: Type.String(),
  ethAddress: Type.String(),
  signature: Type.String(),
})

export const TypeSolanaLogin = Type.Object({
  appId: Type.String(),
  solAddress: Type.String(),
  signature: Type.String(),
})

export const TypeGoogleLogin = Type.Object({
  appId: Type.String(),
  email: Type.String(),
  token: Type.String(),
})

export type UsernameLogin = Static<typeof TypeUsernameLogin>
export type EthereumLogin = Static<typeof TypeEthereumLogin>
export type SolanaLogin = Static<typeof TypeSolanaLogin>
export type GoogleLogin = Static<typeof TypeGoogleLogin>
