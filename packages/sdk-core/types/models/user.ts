import { Static, Type } from '@fastify/type-provider-typebox'
import { Nullable } from './common'

export const TypeUser = Type.Object({
  id: Type.String(),
  email: Nullable(Type.String()),
  google: Nullable(Type.String()),
  twitter: Nullable(Type.String()),
  apple: Nullable(Type.String()),
  ethAddress: Nullable(Type.String()),
  solAddress: Nullable(Type.String()),
})

export type User = Static<typeof TypeUser>
