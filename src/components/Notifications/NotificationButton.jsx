import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications, useMarkNotificationAsRead, useMarkNotificationAsUnread, useMarkAllNotificationsAsRead } from '../../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'
import { getNotificationTarget } from './notificationNavigation'
import { Bell } from 'lucide-react'
import './NotificationButton.css'

export const NotificationButton = () => {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)
    const containerRef = useRef(null)

    const { data: notifications = [], isLoading: notificationsLoading, isFetching: notificationsFetching } = useNotifications({ page, limit: 10 })
    const { markNotificationAsRead } = useMarkNotificationAsRead()
    const { markNotificationAsUnread } = useMarkNotificationAsUnread()
    const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead()

    const unreadCount = notifications?.meta?.unreadCount ?? 0
    const totalPages = notifications?.meta?.totalPages ?? 1

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleToggle = () => {
        setOpen((current) => !current)
    }

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markNotificationAsRead(notification.id)
        }

        setOpen(false)

        navigate(getNotificationTarget(notification))
    }

    const handleMarkAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId)
    }

    const handleMarkAsUnread = async (notificationId) => {
        await markNotificationAsUnread(notificationId)
    }

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return

        await markAllNotificationsAsRead()
    }

    const handlePreviousPage = () => {
        setPage((currentPage) => Math.max(1, currentPage - 1))
    }

    const handleNextPage = () => {
        setPage((currentPage) => Math.min(totalPages, currentPage + 1))
    }

    return (
        <div
            className="app-header-notification-menu"
            ref={containerRef}
        >
            <button
                type="button"
                className="app-header-notification-button"
                aria-label="Notificações"
                aria-expanded={open}
                onClick={handleToggle}
            >
                <Bell
                    size={20}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
                {unreadCount > 0 && (
                    <span className="app-header-notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}

                {unreadCount > 0 && (
                    <span className="app-header-notification-badge">
                        {unreadCount > 99
                            ? '99+'
                            : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="app-header-notification-dropdown">
                    <div className="app-header-notification-dropdown-header">
                        <div className="app-header-notification-dropdown-title">
                            <strong>
                                Notificações
                            </strong>

                            {unreadCount > 0 && (
                                <span className="app-header-notification-dropdown-count">
                                    {unreadCount} não lidas
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="app-header-notification-mark-all-button"
                                onClick={handleMarkAllAsRead}
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    <div className="app-header-notification-list">
                        {notificationsLoading && (
                            <div className="app-header-notification-state">
                                Carregando...
                            </div>
                        )}

                        {!notificationsLoading &&
                            notifications?.data.length === 0 && (
                                <div className="app-header-notification-state">
                                    Nenhuma notificação.
                                </div>
                            )}

                        {!notificationsLoading &&
                            notifications?.data.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAsUnread={handleMarkAsUnread}
                                />
                            ))}
                    </div>

                    <div className="app-header-notification-pagination">
                        <button
                            type="button"
                            aria-label="Página anterior"
                            onClick={handlePreviousPage}
                            disabled={page === 1 || notificationsFetching}
                        >
                            ←
                        </button>

                        <span>
                            {totalPages === 0 ? 0 : page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            aria-label="Próxima página"
                            onClick={handleNextPage}
                            disabled={page >= totalPages || notificationsFetching}
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
