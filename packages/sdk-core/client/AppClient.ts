import { BaseClient } from './BaseClient.ts'

export class AppClient extends BaseClient {
  async createUser(data: {
    email?: string
    telegram?: string
    ethAddress?: string
    solAddress?: string
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
          telegram: string | null
          ethAddress: string | null
          solAddress: string | null
          username: string | null
          referCode: string
          avatar: string | null
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
          telegram: string | null
          ethAddress: string | null
          solAddress: string | null
          username: string | null
          referCode: string
          avatar: string | null
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
  async getUserWallets(userId: string) {
    return (await this.http.get<{ data: { solWallet: string } }>(`/app/users/${userId}/wallets`)).data.data
  }
  async setUserReferrer(userId: string, data: { referCode: string }) {
    return (await this.http.post<{ data: {} }>(`/app/users/${userId}/bind-referrer`, data)).data.data
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
          telegram: string | null
          ethAddress: string | null
          solAddress: string | null
          username: string | null
          referCode: string
          avatar: string | null
        }
      }>(`/app/users/${userId}`)
    ).data.data
  }
}
