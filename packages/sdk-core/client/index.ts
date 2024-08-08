import { AdminClient } from './AdminClient.ts'
import { AppClient } from './AppClient.ts'
import { UserClient } from './UserClient.ts'

export class OpenAuthClient {
  public readonly admin: AdminClient
  public readonly app: AppClient
  public readonly user: UserClient

  constructor(baseURL: string) {
    this.admin = new AdminClient(baseURL)
    this.app = new AppClient(baseURL)
    this.user = new UserClient(baseURL)
  }
}
