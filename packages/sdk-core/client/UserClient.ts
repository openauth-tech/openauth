import { BaseClient } from './BaseClient.ts'

export class UserClient extends BaseClient {
  async bindWithEthereum(data: { ethAddress: string; signature: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-ethereum`, data)).data
  }
  async bindWithGoogle(data: { google: string; signature: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-google`, data)).data
  }
  async bindReferrer(data: { referCode: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-referrer`, data)).data
  }
  async bindWithSolana(data: { solAddress: string; signature: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-solana`, data)).data
  }
  async getConfig(params: { appId: string }) {
    return (
      await this.http.get<{ data: { production: boolean; brand: string; message: string } }>(`/user/config`, { params })
    ).data
  }
  async getProfile() {
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
          referCode: string | null
          username: string | null
        }
      }>(`/user/profile`)
    ).data
  }
  async loginWithEthereum(data: { appId: string; ethAddress: string; signature: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-ethereum`, data)).data
  }
  async loginWithGoogle(data: { appId: string; email: string; token: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-google`, data)).data
  }
  async loginWithSolana(data: { appId: string; solAddress: string; signature: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-solana`, data)).data
  }
  async loginWithUsername(data: { appId: string; username: string; password: string; isRegister: boolean }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-username`, data)).data
  }
  async updatePassword(data: { oldPassword: string; newPassword: string }) {
    return (await this.http.post<{ data: {} }>(`/user/update-password`, data)).data
  }
}
