import { useCallback, useState } from 'react'
import { ToastContext } from '../contexts/ToastContext'
import { ToastContainer } from '../components/ToastContainer/ToastContainer'

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = crypto.randomUUID()

        setToasts((currentToasts) => [
            ...currentToasts,
            {
                id, type, title, message, duration
            }
        ])

        return id
    }, [])

    const success = useCallback((options) => {
        return showToast({
            ...options,
            type: 'success'
        })
    }, [showToast])

    const error = useCallback((options) => {
        return showToast({
            ...options,
            type: 'error'
        })
    }, [showToast])

    const warning = useCallback((options) => {
        return showToast({
            ...options,
            type: 'warning'
        })
    }, [showToast])

    const info = useCallback((options) => {
        return showToast({
            ...options,
            type: 'info'
        })
    }, [showToast])

    return (
        <ToastContext.Provider
            value={{
                toasts,
                showToast,
                success,
                error,
                warning,
                info,
                removeToast
            }}
        >{children}
            <ToastContainer
                toasts={toasts}
                onRemove={removeToast}
            />
        </ToastContext.Provider>
    )
}