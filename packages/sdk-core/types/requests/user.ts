import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeUpdatePassword = Type.Object({
  oldPassword: Type.String(),
  newPassword: Type.String(),
})

export type UpdatePassword = Static<typeof TypeUpdatePassword>
