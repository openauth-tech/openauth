export interface JwtPayload {
  appId: string
  userId: string
  sessionId: string
}

export interface AdminJwtPayload {
  adminId: number
}

export interface AppAuthPayload {
  appId: string
}
