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
      if (res.status >= 400) {
        console.info(res)
        throw new Error(res?.data?.message ?? 'Unkown error')
      }
      return res
    },
    async (error) => {
      throw new Error(error.response?.data?.message ?? error.message ?? 'Unkown error')
    }
  )

  return instance
}
