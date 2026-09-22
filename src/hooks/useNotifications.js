import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markNotificationAsRead, markNotificationAsUnread, markAllNotificationsAsRead } from '../services/notificationsService'

export const useNotifications = ({ page = 1, limit = 10 } = {}) => {
    return useQuery({
        queryKey: ['notifications', { page, limit }],
        queryFn: () => getNotifications({ page, limit }),
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData,
    })
}

const _updateNotification = (queryClient, { notification, unreadCount }) => {
    queryClient.setQueriesData({ queryKey: ['notifications'] }, (currentData) => {
        if (!currentData?.data) return currentData

        const updatedData = currentData.data.map((notif) => notif.id === notification.id
            ? { ...notif, ...notification }
            : notif
        )

        return {
            ...currentData,
            data: updatedData,
            meta: {
                ...currentData.meta,
                unreadCount
            }
        }
    })
}

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient()

    const markNotificationAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,

        onSuccess: (data) => _updateNotification(queryClient, data)
    })

    return { markNotificationAsRead: markNotificationAsReadMutation.mutateAsync }
}

export const useMarkNotificationAsUnread = () => {
    const queryClient = useQueryClient()

    const markNotificationAsUnreadMutation = useMutation({
        mutationFn: markNotificationAsUnread,

        onSuccess: (data) => _updateNotification(queryClient, data)
    })

    return { markNotificationAsUnread: markNotificationAsUnreadMutation.mutateAsync }
}

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient()

    const markAllNotificationsAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,

        onSuccess: ({ unreadCount }) => {
            queryClient.setQueriesData({ queryKey: ['notifications'] }, (currentData) => {
                if (!currentData?.data) return currentData

                const updatedData = currentData.data.map((notif) => notif.is_read
                    ? notif
                    : { ...notif, is_read: true }
                )

                return {
                    ...currentData,
                    data: updatedData,
                    meta: {
                        ...currentData.meta,
                        unreadCount
                    }
                }
            })
        }
    })

    return { markAllNotificationsAsRead: markAllNotificationsAsReadMutation.mutateAsync }
}