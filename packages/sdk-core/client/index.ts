import { UserClient } from './UserClient.ts'
import { AdminClient } from './AdminClient.ts'
import { AppClient } from './AppClient.ts'

export class OpenAuthClient {
  public readonly admin: AdminClient
  public readonly app: AppClient
  public readonly user: UserClient

  constructor(baseURL: string, token?: string) {
    this.admin = new AdminClient(baseURL, token)
    this.app = new AppClient(baseURL, token)
    this.user = new UserClient(baseURL, token)
  }
}
