import { Static, Type } from '@fastify/type-provider-typebox'
import { Nullable } from '../common'

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
  jwtTTL: Type.Number(),
})

export type App = Static<typeof TypeApp>
