import { ApiClient } from './api'
import { AdminClient } from './admin'
import { BaseClient } from './base'

export class OpenAuthClient extends BaseClient {
  public readonly admin: AdminClient
  public readonly api: ApiClient

  constructor(baseURL: string, token?: string) {
    super(baseURL, token)
    this.admin = new AdminClient(baseURL, token)
    this.api = new ApiClient(baseURL, token)
  }

  updateToken(token?: string) {
    super.updateToken(token)
    this.admin.updateToken(token)
    this.api.updateToken(token)
  }
}
