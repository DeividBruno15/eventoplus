
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from '@/contexts/SessionContext'
import { AuthProvider } from '@/hooks/useAuth'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SessionProvider>
  </AuthProvider>
);
