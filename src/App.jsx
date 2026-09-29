import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './providers/AuthProvider'
import { SocketProvider } from './providers/SocketProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRoutes } from './routes/AppRoutes'
import { queryClient } from './config/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App