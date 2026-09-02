import axios from 'axios'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { clearSession } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

const refreshApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

let refreshPromise = null

const refreshAccessToken = async (tokenBeforeRefresh = null) => {
    if (refreshPromise) {
        return await refreshPromise
    }

    refreshPromise = (async () => {
        try {
            if (!navigator.locks) {
                throw new Error('Web Locks API não suportada')
            }

            return await navigator.locks.request('auth-refresh', async () => {
                const currentToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

                if (tokenBeforeRefresh && currentToken && currentToken !== tokenBeforeRefresh) {
                    return currentToken
                }

                const response = await refreshApi.post(API_ENDPOINTS.AUTH.REFRESH)

                const { token } = response.data

                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)

                return token
            })
        } finally {
            refreshPromise = null
        }
    })()

    return await refreshPromise
}

let isHandlingSessionExpiration = false

const handleSessionExpired = () => {
    if (isHandlingSessionExpiration) {
        return
    }

    isHandlingSessionExpiration = true

    clearSession()
    window.location.href = '/login'
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => Promise.reject(error))

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || originalRequest.skipAuthRefresh) {
        return Promise.reject(error)
    }

    const tokenBeforeRefresh = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    originalRequest._retry = true

    try {
        const token = await refreshAccessToken(tokenBeforeRefresh)

        originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
        }

        return api(originalRequest)
    } catch (refreshError) {
        if (refreshError.response?.status === 401) {
            handleSessionExpired()
        }

        return Promise.reject(refreshError)
    }
})

export default api
export { SOCKET_URL }
