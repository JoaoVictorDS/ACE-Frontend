import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const authenticateUser = async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
    })

    return response.data
}

export const logoutUser = async () => {
    return await api.post(API_ENDPOINTS.AUTH.LOGOUT)
}