import { useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useToast } from '../hooks/useToast'
import { useInvalidateNotifications } from '../hooks/useNotification'
import { NotificationMessage } from '../components/Notifications/NotificationMessage'

export const NotificationSocketListener = () => {
    const { socket } = useSocket()
    const { info } = useToast()
    const { invalidateNotifications } = useInvalidateNotifications()

    const event = 'notification:received'

    useEffect(() => {
        const handleNotificationReceived = ({ data, unreadCount }) => {

            info({
                title: 'Nova notificação',
                message: NotificationMessage({ message: data.message })
            })

            invalidateNotifications()
        }

        socket.on(event, handleNotificationReceived)

        return () => {
            socket.off(event, handleNotificationReceived)
        }
    }, [])

    return null
}