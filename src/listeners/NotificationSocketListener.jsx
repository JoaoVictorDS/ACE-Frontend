import { useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useToast } from '../hooks/useToast'
import { useInvalidateNotifications } from '../hooks/useNotification'
import { NotificationMessage } from '../components/Notifications/NotificationMessage'

export const NotificationSocketListener = () => {
    const { socket } = useSocket()
    const { info } = useToast()
    const { invalidateNotifications } = useInvalidateNotifications()

    useEffect(() => {
        if (!socket) {
            return
        }

        const handleNotificationReceived = ({ data, unreadCount }) => {

            info({
                title: 'Nova notificação',
                message: NotificationMessage({ message: data.message })
            })

            invalidateNotifications()
        }

        socket.on('notification:received', handleNotificationReceived)

        return () => {
            socket.off('notification:received', handleNotificationReceived)
        }
    }, [socket, info, invalidateNotifications])

    return null
}