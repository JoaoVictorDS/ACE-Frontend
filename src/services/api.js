import axios from 'axios'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'

const API_URL = import.meta.env.VITE_API_URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

let refreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
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
    const isAuthRoute =
        originalRequest?.url === API_ENDPOINTS.AUTH.LOGIN ||
        originalRequest?.url === API_ENDPOINTS.AUTH.REFRESH ||
        originalRequest?.url === API_ENDPOINTS.AUTH.LOGOUT

    if (error.response?.status !== 401 || originalRequest?._retry || isAuthRoute) {
        return Promise.reject(error)
    }

    if (refreshing) {
        const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
        })

        originalRequest.headers.Authorization = `Bearer ${token}`

        return api(originalRequest)
    }

    originalRequest._retry = true
    refreshing = true

    try {
        const response = await api.post(API_ENDPOINTS.AUTH.REFRESH)

        const { token } = response.data

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)

        originalRequest.headers.Authorization = `Bearer ${token}`

        processQueue(null, token)

        return api(originalRequest)
    } catch (refreshError) {
        processQueue(refreshError, null)

        if (refreshError.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)

            window.dispatchEvent(new Event('auth:session-expired'))
        }

        return Promise.reject(refreshError)
    } finally {
        refreshing = false
    }
})

export default api
export { SOCKET_URL }
