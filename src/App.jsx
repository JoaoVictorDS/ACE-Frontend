import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './providers/AuthProvider'
import { ToastProvider } from './providers/ToastProvider'
import { SocketProvider } from './providers/SocketProvider'
import { NotificationSocketListener } from './listeners/NotificationSocketListener'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRoutes } from './routes/AppRoutes'
import { queryClient } from './config/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <NotificationSocketListener />
            <ThemeProvider>
              <Router>
                <AppRoutes />
              </Router>
            </ThemeProvider>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App