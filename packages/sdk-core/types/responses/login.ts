import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeLoginResponse = Type.Object({
  token: Type.String(),
})
export type LoginResponse = Static<typeof TypeLoginResponse>
