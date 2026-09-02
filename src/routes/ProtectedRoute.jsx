import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen'

export const ProtectedRoute = () => {
    const { isAuthenticated, initializing } = useAuth()

    if (initializing) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}