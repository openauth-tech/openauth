import { BaseClient } from './BaseClient.ts'

export class AdminClient extends BaseClient {
  async getConfig() {
    return (await this.http.get<{ data: { initialized: boolean } }>(`/admin/config`)).data.data
  }
  async login(data: { username: string; password: string }) {
    return (await this.http.post<{ data: { token: string } }>(`/admin/login`, data)).data.data
  }
  async setup(data: { username: string; password: string }) {
    return (await this.http.post<{ data: {} }>(`/admin/setup`, data)).data.data
  }
  async createAdmin(data: { username: string; password: string }) {
    return (await this.http.post<{ data: { id: number; username: string } }>(`/admin/admins`, data)).data.data
  }
  async deleteAdmin(id: number) {
    return (await this.http.delete<{ data: {} }>(`/admin/admins/${id}`)).data.data
  }
  async listAdmins() {
    return (await this.http.get<{ data: { id: number; username: string }[] }>(`/admin/admins`)).data.data
  }
  async updateAdmin(id: number, data: { username: string; password: string }) {
    return (await this.http.patch<{ data: {} }>(`/admin/admins/${id}`, data)).data.data
  }
  async getAdmin(id: number) {
    return (await this.http.get<{ data: { id: number; username: string } }>(`/admin/admins/${id}`)).data.data
  }
  async createApp(data: { name: string }) {
    return (
      await this.http.post<{
        data: {
          id: string
          name: string
          description: string | null
          logoUrl: string | null
          emailEnabled: boolean
          googleEnabled: boolean
          twitterEnabled: boolean
          appleEnabled: boolean
          ethEnabled: boolean
          solEnabled: boolean
          jwtTTL: number
        }
      }>(`/admin/apps`, data)
    ).data.data
  }
  async listApps() {
    return (
      await this.http.get<{
        data: {
          id: string
          name: string
          description: string | null
          logoUrl: string | null
          emailEnabled: boolean
          googleEnabled: boolean
          twitterEnabled: boolean
          appleEnabled: boolean
          ethEnabled: boolean
          solEnabled: boolean
          jwtTTL: number
        }[]
      }>(`/admin/apps`)
    ).data.data
  }
  async deleteApp(appId: string) {
    return (await this.http.delete<{ data: {} }>(`/admin/apps/${appId}`)).data.data
  }
  async getAppSecret(appId: string) {
    return (await this.http.get<{ data: { appSecret: string; jwtSecret: string } }>(`/admin/apps/${appId}/secret`)).data
      .data
  }
  async updateApp(
    appId: string,
    data: {
      name?: string
      description?: string
      logoUrl?: string
      emailEnabled?: boolean
      googleEnabled?: boolean
      twitterEnabled?: boolean
      appleEnabled?: boolean
      ethEnabled?: boolean
      solEnabled?: boolean
      jwtTTL?: number
    }
  ) {
    return (await this.http.patch<{ data: {} }>(`/admin/apps/${appId}`, data)).data.data
  }
  async getApp(appId: string) {
    return (
      await this.http.get<{
        data: {
          id: string
          name: string
          description: string | null
          logoUrl: string | null
          emailEnabled: boolean
          googleEnabled: boolean
          twitterEnabled: boolean
          appleEnabled: boolean
          ethEnabled: boolean
          solEnabled: boolean
          jwtTTL: number
        }
      }>(`/admin/apps/${appId}`)
    ).data.data
  }
}
