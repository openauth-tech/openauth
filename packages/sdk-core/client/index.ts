import { ApiClient } from './api'
import { AdminClient } from './admin'
import { BaseClient } from './base'

export class OpenAuthClient extends BaseClient {
  public readonly admin: AdminClient
  public readonly api: ApiClient
  private token?: string

  constructor(baseURL: string, token?: string) {
    super(baseURL, token)
    this.admin = new AdminClient(baseURL, token)
    this.api = new ApiClient(baseURL, token)
  }

  updateToken(token?: string) {
    this.token = token
    this.admin.updateToken(token)
    this.api.updateToken(token)
  }

  get isAuthorized() {
    return !!this.token
  }
}
