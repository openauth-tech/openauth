import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router-dom'

import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'
import { useHttpClient } from '@/hooks/useHttpClient'

export default function () {
  const { pathname } = useLocation()
  const { id } = useParams<{ id: string }>()
  const http = useHttpClient()
  const { data } = useQuery({
    queryKey: ['getApp', id],
    queryFn: () => http.get('/admin/apps/' + id).then((res: any) => res.data),
  })

  return (
    <AppContainer>
      <AppHeader
        title="Wolcome"
        subtitle="Here are a few things we recommend doing to to build a delightful, secure experience for your users."
      />

      <div className="mt-5 space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Set user login methods</CardTitle>
            <CardDescription>Select the login methods you want to enable in your app.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to={`${pathname}/login-methods`} className="flex-center gap-1 font-bold text-purple-500">
              Login methods
              <span className="i-lucide:arrow-right inline-flex w-4 h-4 translate-y-0.25"></span>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Customize to match your brand</CardTitle>
            <CardDescription>Add your logo and colors to make OpenAuth yours.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to={`${pathname}/branding`} className="flex-center gap-1 font-bold text-purple-500">
              Branding
              <span className="i-lucide:arrow-right inline-flex w-4 h-4 translate-y-0.25"></span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AppContainer>
  )
}
