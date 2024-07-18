import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeCreateApp = Type.Object({
  name: Type.String(),
})
export type CreateApp = Static<typeof TypeCreateApp>

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

export type UpdateApp = Static<typeof TypeUpdateApp>
