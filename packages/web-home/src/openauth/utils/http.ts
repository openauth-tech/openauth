import axios from 'axios'

import { IOpenAuthConfig } from '@/openauth/context/types'

export function buildHttpClient(config: IOpenAuthConfig, token?: String) {
  const instance = axios.create({ baseURL: config.endpoint })

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    async ({ data }) => {
      if (data.error) {
        throw new Error(data.error)
      }
      return data
    },
    async ({ response }) => {
      if (response && response.data && response.data.error) {
        if (response.data.error === 'Unauthorized') {
          response.data.error = 'Unauthorized, please log in again.'
        }
        throw new Error(response.data.error)
      } else {
        console.error(response)
        throw new Error(response?.data?.message ?? 'Server Error')
      }
    }
  )

  return instance
}
