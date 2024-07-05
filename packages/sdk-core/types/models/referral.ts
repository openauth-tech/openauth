import { Static, Type } from '@fastify/type-provider-typebox'

export const TypeReferral = Type.Object({
  refee1Count: Type.Number(),
  refee2Count: Type.Number(),
})

export type Referral = Static<typeof TypeReferral>
