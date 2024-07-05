import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { buildHttpClient } from '@/hooks/useHttpClient'

type AppAtate = {
  username?: string
  token?: string
  logIn: (username: string, password: string) => Promise<void>
}

export const useAppState = create(
  persist<AppAtate>(
    (set) => ({
      logIn: async (username: string, password: string) => {
        const http = buildHttpClient()
        const { data } = await http.post<{ token: string }>('/admin/login', { username, password })
        set({ token: data.token, username })
      },
    }),
    {
      name: 'OpenAuth:App',
    }
  )
)
