import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import { toast } from 'sonner'

import { Header } from '@/components/common/Header'
import { useAdmin } from '@/context/admin'
import { useSetupChecker } from '@/hooks/useSetupChecker'
import routes from '~react-pages'

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

// eslint-disable-next-line import/no-default-export
export default function App() {
  const nav = useNavigate()
  const { client, logOut } = useAdmin()
  useEffect(() => {
    // eslint-disable-next-line require-await
    client.admin.onError = async (error) => {
      toast.error(error.message)
      if (error.message === 'Unauthorized') {
        logOut()
        nav('/login')
      }
    }
  }, [client, logOut, nav])

  useSetupChecker()

  return (
    <>
      <Header />
      <div className="mx-auto container lt-sm:px-4">
        {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
      </div>
      <Toaster />
    </>
  )
}
