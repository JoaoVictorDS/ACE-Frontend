import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { AuthContext } from '../contexts/AuthContext'
import { authenticateUser, logoutUser } from '../services/authService'
import { useQueryClient } from '@tanstack/react-query'

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient()

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [initializing, setInitializing] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

        setIsAuthenticated(!!token)
        setInitializing(false)
    }, [])

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === STORAGE_KEYS.ACCESS_TOKEN && event.newValue === null) {
                queryClient.removeQueries({
                    queryKey: ['user'],
                })

                setIsAuthenticated(false)
            }
        }

        window.addEventListener('storage', handleStorage)
        return () => {
            window.removeEventListener('storage', handleStorage)
        }
    }, [queryClient])

    useEffect(() => {
        const handleSessionExpired = () => {
            queryClient.removeQueries({
                queryKey: ['user'],
            })

            setIsAuthenticated(false)
        }

        window.addEventListener('auth:session-expired', handleSessionExpired)
        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired)
        }
    }, [queryClient])


    const login = async (email, password) => {
        setLoading(true)
        setError(null)

        try {
            const { token, user } = await authenticateUser(email, password)

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)

            queryClient.setQueryData(['user'], user)

            setIsAuthenticated(true)

            return user
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao fazer login'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)

        try {
            await logoutUser()
        } catch (err) {
            console.error('Erro ao fazer logout:', err)
        } finally {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            queryClient.removeQueries({
                queryKey: ['user'],
            })
            setIsAuthenticated(false)
            setError(null)
            setLoading(false)
        }
    }

    const value = {
        isAuthenticated,
        initializing,
        loading,
        error,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}