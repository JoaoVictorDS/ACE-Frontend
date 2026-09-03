import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App