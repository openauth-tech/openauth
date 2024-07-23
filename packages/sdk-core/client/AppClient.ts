import { BaseClient } from './BaseClient.ts'
import {
  Admin,
  AdminCreateUser,
  App,
  AppSecret,
  CreateAdmin,
  CreateApp,
  LoginResponse,
  PageMeta,
  PageParams,
  ReferralResponse,
  UpdateApp,
  User,
} from '../types'

export class AppClient extends BaseClient {
  async setup(data: CreateAdmin) {
    return (await this.http.post('/admin/setup', data)).data
  }

  async login(data: CreateAdmin) {
    return (await this.http.post<{ data: LoginResponse }>('/admin/login', data)).data.data
  }

  async getAdmins(params: PageParams) {
    return (await this.http.get<{ data: Admin[]; meta: PageMeta }>('/admin/admins?', { params })).data.data
  }

  async getAdmin(id: string) {
    return (await this.http.get<{ data: Admin }>(`/admin/admins/${id}`)).data.data
  }

  async createAdmin(data: CreateAdmin) {
    return (await this.http.post<{ data: Admin }>('/admin/admins', data)).data.data
  }

  async updateAdmin(id: string, data: CreateAdmin) {
    return (await this.http.patch<{ data: Admin }>(`/admin/admins/${id}`, data)).data.data
  }

  async deleteAdmin(id: string) {
    return (await this.http.delete(`/admin/admins/${id}`)).data
  }

  async getApps() {
    return (await this.http.get<{ data: App[] }>('/admin/apps')).data.data
  }

  async getApp(id: string) {
    return (await this.http.get<{ data: App }>(`/admin/apps/${id}`)).data.data
  }

  async createApp(data: CreateApp) {
    return (await this.http.post<{ data: App }>('/admin/apps', data)).data.data
  }

  async updateApp(id: string, data: UpdateApp) {
    return (await this.http.patch<{ data: App }>(`/admin/apps/${id}`, data)).data.data
  }

  async deleteApp(id: string) {
    return (await this.http.delete(`/admin/apps/${id}`)).data
  }

  async getUsers(appId: string, params: PageParams) {
    return (await this.http.get<{ data: User[]; meta: PageMeta }>(`/admin/apps/${appId}/users`, { params })).data
  }

  async createUser(appId: string, data: AdminCreateUser) {
    return (await this.http.post<{ data: User }>(`/admin/apps/${appId}/users`, data)).data.data
  }

  async getUser(appId: string, userId: string) {
    return (await this.http.get<{ data: User }>(`/admin/apps/${appId}/users/${userId}`)).data.data
  }

  async getUserReferral(appId: string, userId: string) {
    return (await this.http.get<{ data: ReferralResponse }>(`/admin/apps/${appId}/users/${userId}/referral`)).data.data
  }

  async getSecret(appId: string) {
    return (await this.http.get<{ data: AppSecret }>(`/admin/apps/${appId}/secret`)).data.data
  }
}