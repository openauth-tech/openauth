import { OpenAuthClient } from '@open-auth/sdk-core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ProviderAuth } from './context/ProviderAuth'

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

const authClient = new OpenAuthClient(import.meta.env.VITE_OPENAUTH_ENDPOINT!)

const root = createRoot(document.getElementById('root')!)
root.render(
  <QueryClientProvider client={queryClient}>
    <ProviderAuth value={authClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProviderAuth>
  </QueryClientProvider>
)
