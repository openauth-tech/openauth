export interface JwtPayload {
  userId: string
  appId: string
}

export interface AdminJwtPayload {
  adminId: number
}

export interface AppAuthPayload {
  appId: string
}
