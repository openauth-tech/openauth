import { AxiosInstance } from 'axios'
import { buildHttpClient } from '../utils/buildHttpClient'

export class BaseClient {
  private readonly baseURL: string
  protected http: AxiosInstance
  private token?: string

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL
    this.updateToken(token)
  }

  public updateToken(token?: string) {
    this.token = token
    this.http = buildHttpClient(this.baseURL, token)
  }
}
