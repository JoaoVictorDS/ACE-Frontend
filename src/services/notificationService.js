import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getNotifications = async ({ page = 1, limit = 10 }) => {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.GET, {
        params: {
            page,
            limit,
        }
    })

    return response.data
}

export const markNotificationAsRead = async (notificationId) => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId))

    return response.data
}

export const markNotificationAsUnread = async (notificationId) => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_UNREAD(notificationId))

    return response.data
}

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ)

    return response.data
}