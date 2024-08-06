import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AdminProvider } from './context/admin'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './assets/styles/index.css'

console.table(import.meta.env)

if (import.meta.env.PROD) {
  console.debug = () => {}
  console.log = () => {}
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

const root = createRoot(document.querySelector('#root')!)
root.render(
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AdminProvider>
  </QueryClientProvider>,
)
