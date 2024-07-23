import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { Header } from '@/components/common/Header'
import { useSetupChecker } from '@/hooks/useSetupChecker'
import routes from '~react-pages'

function Redirect({ to }: { to: string }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

export default function App() {
  useSetupChecker()

  return (
    <>
      <Header />
      <div className="container mx-auto lt-sm:px-4">
        {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
      </div>
      <Toaster />
    </>
  )
}
