import { AxiosInstance } from 'axios'
import { buildHttpClient } from '../utils/buildHttpClient'

export class BaseClient {
  protected http: AxiosInstance
  private readonly baseURL: string
  private token?: string

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
