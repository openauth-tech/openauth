import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeCreateAdmin = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export type CreateAdmin = Static<typeof TypeCreateAdmin>
