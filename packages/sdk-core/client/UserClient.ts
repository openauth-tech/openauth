import { BaseClient } from './BaseClient.ts'
import {
  AdminConfig,
  EthereumLogin,
  GlobalConfig,
  GoogleLogin,
  LoginResponse,
  SolanaLogin,
  UpdatePassword,
  User,
  UsernameLogin,
} from '../types'

export class UserClient extends BaseClient {
  async getAdminConfig() {
    return (await this.http.get<{ data: AdminConfig }>('/config/admin')).data.data
  }

  async getGlobalConfig(appId: string) {
    return (await this.http.get<{ data: GlobalConfig }>(`/config/global?appId=${appId}`)).data.data
  }

  async loginSolana(data: SolanaLogin) {
    return (await this.http.post<{ data: LoginResponse }>('/login/solana', data)).data.data
  }

  async loginEthereum(data: EthereumLogin) {
    return (await this.http.post<{ data: LoginResponse }>('/login/ethereum', data)).data.data
  }

  async loginGoogle(data: GoogleLogin) {
    return (await this.http.post<{ data: LoginResponse }>('/login/google', data)).data.data
  }

  async bindUsername(data: UsernameLogin) {
    return (await this.http.post('/bind/username', data)).data
  }

  async bindSolana(data: SolanaLogin) {
    return (await this.http.post('/user/bind-solana', data)).data
  }

  async bindEthereum(data: EthereumLogin) {
    return (await this.http.post('/user/bind-ethereum', data)).data
  }

  async bindGoogle(data: GoogleLogin) {
    return (await this.http.post('/user/bind-google', data)).data
  }

  async getUserProfile() {
    return (await this.http.get<{ data: User }>('/user/profile')).data.data
  }

  async bindReferrer(data: { referCode: string }) {
    return (await this.http.post('/user/bind-referrer', data)).data
  }

  async loginUsername(data: UsernameLogin) {
    return (await this.http.post<{ data: LoginResponse }>('/login/username', data)).data.data
  }

  async updatePassword(data: UpdatePassword) {
    return (await this.http.post<{ data: User }>('/user/update-password', data)).data.data
  }
}