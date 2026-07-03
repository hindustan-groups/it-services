import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
// Local fonts — no internet required
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './index.css'
import App from './App.jsx'

// Inject reCAPTCHA site key as a meta tag so index.html can pick it up
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
if (recaptchaSiteKey) {
  const meta = document.createElement('meta')
  meta.name = 'recaptcha-site-key'
  meta.content = recaptchaSiteKey
  document.head.appendChild(meta)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Stale time: data stays fresh for 2 min before refetch
      staleTime: 2 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
