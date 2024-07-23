import { AxiosInstance } from 'axios'
import { buildHttpClient } from '../utils/buildHttpClient'

export class BaseClient {
  private readonly baseURL: string
  private token?: string
  protected http: AxiosInstance

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL
    this.token = token
    this.http = buildHttpClient(this.baseURL, token)
  }

  public updateToken(token?: string) {
    this.token = token
    this.http = buildHttpClient(this.baseURL, token)
  }

  public isAuthorized() {
    return !!this.token
  }
}
