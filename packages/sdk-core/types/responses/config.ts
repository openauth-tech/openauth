import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeAdminConfig = Type.Object({
  initialized: Type.Boolean(),
})

export const TypeGlobalConfig = Type.Object({
  production: Type.Boolean(),
  brand: Type.String(),
  message: Type.String(),
})

export type AdminConfig = Static<typeof TypeAdminConfig>
export type GlobalConfig = Static<typeof TypeGlobalConfig>
