import { OpenAuthProvider } from '@open-auth/sdk-react/context/OpenAuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

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

const root = createRoot(document.getElementById('root')!)
root.render(
  <OpenAuthProvider
    config={{
      appId: import.meta.env.VITE_OPENAUTH_APPID,
      endpoint: import.meta.env.VITE_OPENAUTH_ENDPOINT,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </OpenAuthProvider>
)
