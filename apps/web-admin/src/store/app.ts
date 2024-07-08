import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AppAtate = {
  username?: string
  token?: string
  saveToken: (username: string, token: string) => void
}

export const useAppState = create(
  persist<AppAtate>(
    (set) => ({
      saveToken: async (username: string, token: string) => {
        set({ token, username })
      },
    }),
    {
      name: 'OpenAuth:App',
    }
  )
)
