import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'

import { AppTabs } from '@/components/app/AppTabs'
import { Loading } from '@/components/common/Loading'
import { useAdmin } from '@/context/admin'

interface Props {
  loading?: boolean
  children: React.ReactNode
}

export function AppContainer({ children, loading }: Props) {
  const { id = '' } = useParams()
  const { client } = useAdmin()
  const { data } = useQuery({
    queryKey: ['getApp', id],
    queryFn: () => client.admin.getApp(id),
    enabled: client.admin.isAuthorized(),
  })

  if (!data) {
    return null
  }

  return (
    <div className="">
      <div className="text-2xl font-semibold border-b pb-4 px-20 ">{data.name}</div>
      <div className="flex flex-row mt-4 px-20 ">
        <AppTabs />
        <div className="px-20 py-2 flex-1 max-w-6xl">
          {loading ? (
            <div className="flex-center p-8">
              <Loading />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}
