import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useHttpClient } from '@/hooks/useHttpClient'

export function useSetupChecker() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const { data } = useQueryAdminConfig()

  useEffect(() => {
    if (data) {
      if (pathname !== '/setup' && !data.initialized) {
        console.log('Redirect to /setup', pathname, data)
        nav('/setup')
      }
    }
  }, [nav, pathname, data])
}

export function useQueryAdminConfig() {
  const http = useHttpClient()

  return useQuery<{ initialized: boolean }>({
    queryKey: ['getAdminConfig'],
    queryFn: () => http.get('/config/admin').then((res: any) => res.data),
  })
}
