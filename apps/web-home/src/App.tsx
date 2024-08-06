import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { Header } from '@/components/common/Header'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
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
  const { toasts } = useToast()

  return (
    <>
      <Header />
      <div className="mx-auto min-h-[calc(100vh-100px)]">
        {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
      </div>
      <ToastProvider duration={2000}>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    </>
  )
}
