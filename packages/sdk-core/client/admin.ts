import { BaseClient } from './base'
import { Admin, App, CreateAdmin, CreateApp, PageMeta, PageParams, UpdateApp, User } from '../types'

export class AdminClient extends BaseClient {
  async setup(data: CreateAdmin) {
    return (await this.http.post('/admin/setup', data)).data
  }

  async login(data: CreateAdmin) {
    return (await this.http.post<{ token: string }>('/admin/login', data)).data
  }

  async getAdmins({ page, limit }: { page: number; limit: number }) {
    const queryStr = new URLSearchParams({ page: page.toString(), limit: limit.toString() }).toString()
    return (await this.http.get<{ data: Admin[]; meta: PageMeta }>('/admin/admins?' + queryStr)).data.data
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

  async deleteAdmin(id: Admin) {
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

  async getUsers(appId: string, { page, limit }: PageParams) {
    const queryStr = new URLSearchParams({ page: page.toString(), limit: limit.toString() }).toString()
    return (await this.http.get<{ data: User[]; meta: PageMeta }>(`/admin/apps/${appId}/users?${queryStr}`)).data.data
  }
}
