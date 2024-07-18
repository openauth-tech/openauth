import { Static, Type } from '@fastify/type-provider-typebox'
import { TSchema } from '@sinclair/typebox'

export const Nullable = <T extends TSchema>(schema: T) => Type.Union([schema, Type.Null()])

export const TypePageMeta = Type.Object({
  totalItems: Type.Integer(),
  totalPages: Type.Integer(),
})
export type PageMeta = Static<typeof TypePageMeta>

export const TypePageParams = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  limit: Type.Integer({ minimum: 1, maximum: 100 }),
})
export type PageParams = Static<typeof TypePageParams>

export const TypeAuthHeaders = Type.Object({
  Authorization: Type.String(),
})
export type AuthHeaders = Static<typeof TypeAuthHeaders>
