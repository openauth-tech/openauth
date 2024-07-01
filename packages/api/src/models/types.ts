import { Type } from '@fastify/type-provider-typebox'
import { Nullable } from '../constants/schema'

export const TypeCreateApp = Type.Object({
  name: Type.String(),
})

export const TypeUpdateApp = Type.Object({
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  logoUrl: Type.Optional(Type.String()),
  emailEnabled: Type.Optional(Type.Boolean()),
  googleEnabled: Type.Optional(Type.Boolean()),
  twitterEnabled: Type.Optional(Type.Boolean()),
  appleEnabled: Type.Optional(Type.Boolean()),
  ethEnabled: Type.Optional(Type.Boolean()),
  solEnabled: Type.Optional(Type.Boolean()),
})

export const TypeApp = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Nullable(Type.String()),
  logoUrl: Nullable(Type.String()),
  emailEnabled: Type.Boolean(),
  googleEnabled: Type.Boolean(),
  twitterEnabled: Type.Boolean(),
  appleEnabled: Type.Boolean(),
  ethEnabled: Type.Boolean(),
  solEnabled: Type.Boolean(),
})

export const TypeUser = Type.Object({
  id: Type.String(),
  email: Nullable(Type.String()),
  google: Nullable(Type.String()),
  twitter: Nullable(Type.String()),
  apple: Nullable(Type.String()),
  ethAddress: Nullable(Type.String()),
  solAddress: Nullable(Type.String()),
})

export const TypeCreateAdmin = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export const TypeAdmin = Type.Object({
  id: Type.Number(),
  ...TypeCreateAdmin.properties,
})
