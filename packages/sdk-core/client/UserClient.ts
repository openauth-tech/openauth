import { BaseClient } from './BaseClient.ts'

export class UserClient extends BaseClient {
  async bindWithEthereum(data: { ethAddress: string; signature: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-ethereum`, data)).data.data
  }
  async bindWithGoogle(data: { google: string; signature: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-google`, data)).data.data
  }
  async bindReferrer(data: { referCode: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-referrer`, data)).data.data
  }
  async bindWithSolana(data: { solAddress: string; signature: string }) {
    return (await this.http.post<{ data: {} }>(`/user/bind-solana`, data)).data.data
  }
  async getConfig(params: { appId: string }) {
    return (
      await this.http.get<{ data: { production: boolean; brand: string; message: string } }>(`/user/config`, { params })
    ).data.data
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
          username: string | null
          referCode: string
        }
      }>(`/user/profile`)
    ).data.data
  }
  async logInWithEthereum(data: { appId: string; ethAddress: string; signature: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-ethereum`, data)).data.data
  }
  async logInWithGoogle(data: { appId: string; email: string; token: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-google`, data)).data.data
  }
  async logInWithSolana(data: { appId: string; solAddress: string; signature: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-solana`, data)).data.data
  }
  async logInWithUsername(data: { appId: string; username: string; password: string; isRegister?: boolean }) {
    return (await this.http.post<{ data: { token: string } }>(`/user/login-username`, data)).data.data
  }
  async updatePassword(data: { oldPassword: string; newPassword: string }) {
    return (await this.http.post<{ data: {} }>(`/user/update-password`, data)).data.data
  }
  async getWallets() {
    return (await this.http.get<{ data: { solWallet: string } }>(`/user/wallet/profile`)).data.data
  }
}
