import { BaseClient } from './BaseClient.ts'

export class AppClient extends BaseClient {
  async createUser(data: {
    ethAddress?: string
    solAddress?: string
    email?: string
    username?: string
    password?: string
  }) {
    return (
      await this.http.post<{
        data: {
          id: string
          email: string | null
          google: string | null
          twitter: string | null
          apple: string | null
          ethAddress: string | null
          solAddress: string | null
          username: string | null
          referCode: string
        }
      }>(`/app/users`, data)
    ).data.data
  }
  async listUsers(params: { page: number; limit: number }) {
    return (
      await this.http.get<{
        data: {
          id: string
          email: string | null
          google: string | null
          twitter: string | null
          apple: string | null
          ethAddress: string | null
          solAddress: string | null
          username: string | null
          referCode: string
        }[]
        meta: { totalItems: number; totalPages: number }
      }>(`/app/users`, { params })
    ).data
  }
  async getUserReferral(userId: string) {
    return (
      await this.http.get<{
        data: {
          referrals1: { createdAt: number; userId: string }[]
          referrals2: { createdAt: number; userId: string }[]
        }
      }>(`/app/users/${userId}/referral`)
    ).data.data
  }
  async getWallets(userId: string) {
    return (await this.http.get<{ data: { solWallet: string } }>(`/app/users/${userId}/wallets`)).data.data
  }
  async getUser(userId: string) {
    return (
      await this.http.get<{
        data: {
          id: string
          email: string | null
          google: string | null
          twitter: string | null
          apple: string | null
          ethAddress: string | null
          solAddress: string | null
          username: string | null
          referCode: string
        }
      }>(`/app/users/${userId}`)
    ).data.data
  }
}
