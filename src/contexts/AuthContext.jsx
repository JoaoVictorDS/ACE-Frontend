import { createContext, useState, useEffect, useCallback } from 'react'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { clearSession } from '../utils/auth'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [initializing, setInitializing] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

            if (!token) {
                setUser(null)
                setInitializing(false)

                return
            }

            try {
                const response = await api.get(API_ENDPOINTS.USERS.PROFILE)

                const profile = response.data

                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))

                setUser(profile)
                setError(null)
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error('Erro ao restaurar sessão:', err)
                }
            } finally {
                setInitializing(false)
            }
        }

        initializeAuth()
    }, [])

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === STORAGE_KEYS.ACCESS_TOKEN && event.newValue === null) {
                setUser(null)
                setError(null)

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }

                return
            }

            if (event.key === STORAGE_KEYS.USER) {
                if (!event.newValue) {
                    setUser(null)
                    setError(null)

                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login'
                    }

                    return
                }

                const profile = JSON.parse(event.newValue)

                setUser(profile)
                setError(null)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const login = useCallback(async (email, password) => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
                email,
                password,
            }, { skipAuthRefresh: true })

            const { token, user: profile } = response.data

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))

            setUser(profile)

            return profile
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao fazer login'

            setError(errorMessage)

            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT, undefined, { skipAuthRefresh: true })
        } catch (err) {
            console.error('Erro ao fazer logout:', err)
        } finally {
            clearSession()

            setUser(null)
            setError(null)
        }
    }, [])

    const value = {
        user,
        loading,
        initializing,
        error,
        login,
        logout,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}