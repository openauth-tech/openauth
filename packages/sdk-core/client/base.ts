import { AxiosInstance } from 'axios'
import { buildHttpClient } from '../utils/buildHttpClient'

export class BaseClient {
  private readonly baseURL: string
  protected http: AxiosInstance

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL
    this.http = buildHttpClient(this.baseURL, token)
  }

  public updateToken(token?: string) {
    this.http = buildHttpClient(this.baseURL, token)
  }
}