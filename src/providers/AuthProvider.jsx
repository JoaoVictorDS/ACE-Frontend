import { useEffect } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { AuthContext } from '../contexts/AuthContext'
import { authenticateUser, logoutUser } from '../services/authService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '../hooks/useUser'

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient()

    const { data: user, isLoading: userLoading } = useUser()

    const hasToken = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const initializing = hasToken && userLoading

    const _clearQuery = () => {
        queryClient.setQueryData(['user'], null)
        queryClient.clear()
    }

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === STORAGE_KEYS.ACCESS_TOKEN && event.newValue === null) {
                _clearQuery()
            }
        }

        window.addEventListener('storage', handleStorage)
        return () => {
            window.removeEventListener('storage', handleStorage)
        }
    }, [queryClient])

    useEffect(() => {
        const handleSessionExpired = () => {
            _clearQuery()
        }

        window.addEventListener('auth:session-expired', handleSessionExpired)
        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired)
        }
    }, [queryClient])

    const loginMutation = useMutation({
        mutationFn: authenticateUser,

        onSuccess: ({ token, user }) => {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)

            queryClient.setQueryData(['user'], user)
        }
    })

    const logoutMutation = useMutation({
        mutationFn: logoutUser,

        onSettled: () => {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            _clearQuery()
        },
    })

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!user,

            initializing,

            login: loginMutation.mutateAsync,
            logout: logoutMutation.mutateAsync,

            loginLoading: loginMutation.isPending,
            logoutLoading: logoutMutation.isPending,

            loginError: loginMutation.error,
            logoutError: logoutMutation.error,
        }}>{children}</AuthContext.Provider>
    )
}