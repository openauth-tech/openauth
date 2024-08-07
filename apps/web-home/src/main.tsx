import { OpenAuthProvider } from '@open-auth/sdk-react'
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
      googleClientId: '868364359161-r53l284na254rqkd7r92rlguufc6aahd.apps.googleusercontent.com',
      discordApplicationId: '1270776138020687882',
    }}
  >
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </OpenAuthProvider>
)
