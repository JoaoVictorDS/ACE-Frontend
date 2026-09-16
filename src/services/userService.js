import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getUserProfile = async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE)

    return response.data
}

export const updateUserProfile = async (data = {}) => {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE, data)

    return response.data
}

export const updateUserPassword = async (data = {}) => {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE_PASSWORD, data)

    return response.data
}