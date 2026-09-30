import { useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useToast } from '../hooks/useToast'
import { useReceiveNotification } from '../hooks/useNotification'
import { NotificationMessage } from '../components/Notifications/NotificationMessage'

export const NotificationSocketListener = () => {
    const { socket } = useSocket()
    const { info } = useToast()
    const { receiveNotification } = useReceiveNotification()

    const event = 'notification:received'

    useEffect(() => {
        const handleNotificationReceived = ({ data, unreadCount }) => {

            info({
                title: 'Nova notificação',
                message: NotificationMessage({ message: data.message })
            })

            receiveNotification({ notification: data, unreadCount })
        }

        socket.on(event, handleNotificationReceived)

        return () => {
            socket.off(event, handleNotificationReceived)
        }
    }, [])

    return null
}