import { Static, Type } from '@fastify/type-provider-typebox'
import { Nullable } from './common'

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

export type CreateApp = Static<typeof TypeCreateApp>
export type UpdateApp = Static<typeof TypeUpdateApp>
export type App = Static<typeof TypeApp>
