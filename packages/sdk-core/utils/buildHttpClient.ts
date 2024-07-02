import axios from 'axios'

export function buildHttpClient(baseURL: string, token?: string) {
  const instance = axios.create({ baseURL })

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
    async (res) => {
      if (res.data.error) {
        throw new Error(res.data.error)
      }
      return res
    },
    async ({ response }) => {
      if (response && response.data && response.data.error) {
        throw new Error(response.data.error)
      } else {
        throw new Error(response?.data?.message ?? 'Server Error')
      }
    }
  )

  return instance
}
