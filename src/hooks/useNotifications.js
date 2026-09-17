import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markNotificationAsRead, markNotificationAsUnread, markAllNotificationsAsRead } from '../services/notificationsService'

export const useNotifications = ({ page = 1, limit = 10 } = {}) => {
    const queryClient = useQueryClient()

    const notificationsQuery = useQuery({
        queryKey: ['notifications', { page, limit }],
        queryFn: () => getNotifications({ page, limit }),
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData,
    })

    const updateNotification = ({ notification, unreadCount }) => {
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

    const markNotificationAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,

        onSuccess: updateNotification
    })

    const markNotificationAsUnreadMutation = useMutation({
        mutationFn: markNotificationAsUnread,

        onSuccess: updateNotification
    })

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

    return {
        ...notificationsQuery,

        markNotificationAsRead: markNotificationAsReadMutation.mutateAsync,
        markNotificationAsUnread: markNotificationAsUnreadMutation.mutateAsync,
        markAllNotificationsAsRead: markAllNotificationsAsReadMutation.mutateAsync,
    }
}