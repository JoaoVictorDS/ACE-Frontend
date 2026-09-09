import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './providers/AuthProvider'
import { AppRoutes } from './routes/AppRoutes'
import { queryClient } from './config/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App