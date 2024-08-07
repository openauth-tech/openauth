import { Static, Type } from '@fastify/type-provider-typebox'
import { Nullable } from '../common'

export const TypeUser = Type.Object({
  id: Type.String(),
  email: Nullable(Type.String()),
  google: Nullable(Type.String()),
  discord: Nullable(Type.String()),
  twitter: Nullable(Type.String()),
  apple: Nullable(Type.String()),
  telegram: Nullable(Type.String()),
  ethAddress: Nullable(Type.String()),
  solAddress: Nullable(Type.String()),
  username: Nullable(Type.String()),
  referCode: Type.String(),
  avatar: Nullable(Type.String()),
  createdAt: Type.Number(),
  lastSeenAt: Type.Number(),
})

export type User = Static<typeof TypeUser>

export const TypeUserWallets = Type.Object({
  solWallet: Type.String(),
})

export type UserWallets = Static<typeof TypeUserWallets>
