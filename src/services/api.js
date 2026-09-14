import axios from 'axios'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

let refreshPromise = null

async function performRefresh() {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                const response = await refreshApi.post(API_ENDPOINTS.AUTH.REFRESH)
                const { token } = response.data

                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                return token
            } catch (err) {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)

                delete api.defaults.headers.common['Authorization']

                throw err
            } finally {
                refreshPromise = null
            }
        })()
    }

    return refreshPromise
}

async function refreshToken() {
    const tokenBeforeWaiting = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (!navigator.locks) {
        return performRefresh()
    }

    return navigator.locks.request('token-refresh', async () => {
        const currentToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

        if (currentToken && currentToken !== tokenBeforeWaiting) {
            return currentToken
        }

        return performRefresh()
    })
}

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config

    const isAuthRoute =
        originalRequest?.url === API_ENDPOINTS.AUTH.LOGIN ||
        originalRequest?.url === API_ENDPOINTS.AUTH.REFRESH ||
        originalRequest?.url === API_ENDPOINTS.AUTH.LOGOUT

    if (error.response?.status !== 401 || originalRequest?._retry || isAuthRoute) {
        return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
        const token = await refreshToken()

        originalRequest.headers.Authorization = `Bearer ${token}`

        return await api(originalRequest)
    } catch (err) {
        window.dispatchEvent(new Event('auth:session-expired'))

        return Promise.reject(err)
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
}, (error) => Promise.reject(error))

export default api