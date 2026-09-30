import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getUserNotificationSettings = async () => {
    const response = await api.get(API_ENDPOINTS.USERS.NOTIFICATION_SETTINGS.GET)

    return response.data
}

export const updateUserNotificationSettings = async (data = {}) => {
    const response = await api.patch(API_ENDPOINTS.USERS.NOTIFICATION_SETTINGS.UPDATE, data)

    return response.data
}