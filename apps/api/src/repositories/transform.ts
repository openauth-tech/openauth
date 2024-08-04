import { User as UserResponse } from '@open-auth/sdk-core'
import { type User } from '@prisma/client'

export function transformUserToReponse(user?: User | null): UserResponse | null {
  if (!user) {
    return null
  }

  return {
    ...user,
    createdAt: user.createdAt?.getTime() ?? null,
    lastSeenAt: user.lastSeenAt!.getTime(),
  }
}
