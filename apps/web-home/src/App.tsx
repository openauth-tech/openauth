import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { Header } from '@/components/common/Header'
import { Toaster } from '@/components/ui/sonner'
import routes from '~react-pages'

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

export default function App() {
  return (
    <>
      <Header />
      <div className="mx-auto min-h-[calc(100vh-100px)]">
        {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
      </div>
      <Toaster />
    </>
  )
}
