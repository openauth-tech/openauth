import { Static, Type } from '@fastify/type-provider-typebox'

const TypeReferral = Type.Object({
  createdAt: Type.Number(),
  userId: Type.String(),
})

export const TypeReferralResponse = Type.Object({
  referrals1: Type.Array(TypeReferral),
  referrals2: Type.Array(TypeReferral),
})

export type ReferralResponse = Static<typeof TypeReferralResponse>
