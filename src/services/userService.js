import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getUserProfile = async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE)

    return response.data
}