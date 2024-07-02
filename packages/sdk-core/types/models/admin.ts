import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeCreateAdmin = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export const TypeAdmin = Type.Object({
  id: Type.Number(),
  username: Type.String(),
})

export type CreateAdmin = Static<typeof TypeCreateAdmin>
export type Admin = Static<typeof TypeAdmin>
