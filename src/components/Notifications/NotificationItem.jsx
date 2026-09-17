import { NotificationMessage } from './NotificationMessage'
import './NotificationItem.css'

export const NotificationItem = ({ notification, onClick, onMarkAsRead, onMarkAsUnread }) => {
    const actorName = notification.actor?.name || 'Usuário'

    const handleToggleRead = (event) => {
        event.stopPropagation()

        if (notification.is_read) {
            onMarkAsUnread(notification.id)
            return
        }

        onMarkAsRead(notification.id)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick(notification)
        }
    }

    const formattedDate = new Date(notification.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

    return (
        <div
            className={`app-header-notification-item ${!notification.is_read ? 'app-header-notification-item--unread' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onClick(notification)}
            onKeyDown={handleKeyDown}
        >
            <div className="app-header-notification-avatar">
                {actorName.charAt(0).toUpperCase()}
            </div>

            <div className="app-header-notification-content">
                <div className="app-header-notification-message">
                    <NotificationMessage
                        message={notification.message}
                    />
                </div>

                <span className="app-header-notification-date">
                    {formattedDate}
                </span>
            </div>

            <button
                type="button"
                className={`app-header-notification-read-button ${notification.is_read ? 'app-header-notification-read-button--unread' : ''}`}
                aria-label={notification.is_read ? 'Marcar notificação como não lida' : 'Marcar notificação como lida'}
                title={notification.is_read ? 'Marcar como não lida' : 'Marcar como lida'}
                onClick={handleToggleRead}
            >
                {notification.is_read ? '○' : '✓'}
            </button>
        </div>
    )
}
