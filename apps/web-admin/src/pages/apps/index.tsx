import { useQuery } from '@tanstack/react-query'
import { NavLink, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useHttpClient } from '@/hooks/useHttpClient'

export default function () {
  const nav = useNavigate()
  const http = useHttpClient()
  const { data } = useQuery({
    queryKey: ['getApps'],
    queryFn: () => http.get('/admin/apps').then((res: any) => res.data),
    gcTime: 0,
  })

  if (!data) {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex-center justify-between">
        <div>Apps</div>
        <Button onClick={() => nav('/apps/new')}>New App</Button>
      </div>
      <div className="py-6 grid grid-cols-4 gap-2">
        {data.map((i: any) => (
          <NavLink to={`/apps/${i.id}`} key={i.id}>
            <Card className="p-6" key={i.id}>
              <div className="text-lg font-semibold">{i.name}</div>
              <div className="text-xs opacity-50">{i.id}</div>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  )
}