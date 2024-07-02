import { BaseClient } from './base'
import {
  AdminConfig,
  EthereumLogin,
  GlobalConfig,
  GoogleLogin,
  LoginResponse,
  SolanaLogin,
  User,
  UsernameLogin,
} from '../types'

export class ApiClient extends BaseClient {
  async getAdminConfig() {
    return (await this.http.get<{ data: AdminConfig }>('/config/admin')).data.data
  }

  async getGlobalConfig() {
    return (await this.http.get<{ data: GlobalConfig }>('/config/global')).data.data
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
    return (await this.http.post('/bind/solana', data)).data
  }

  async bindEthereum(data: EthereumLogin) {
    return (await this.http.post('/bind/ethereum', data)).data
  }

  async bindGoogle(data: GoogleLogin) {
    return (await this.http.post('/bind/google', data)).data
  }

  async getUserProfile() {
    return (await this.http.get<{ data: User }>('/user/profile')).data.data
  }
}
