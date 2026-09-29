import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import './Toast.css'

const TOAST_ICONS = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: TriangleAlert,
    info: Info
}

export const Toast = ({ toast, onRemove }) => {
    const { id, type, title, message, duration } = toast

    useEffect(() => {
        if (!duration) return

        const timeout = setTimeout(() => {
            onRemove(id)
        }, duration)

        return () => {
            clearTimeout(timeout)
        }
    }, [id, duration, onRemove])

    const Icon = TOAST_ICONS[type] || Info

    return (
        <div
            className={`toast toast--${type}`}
            role={type === 'error' ? 'alert' : 'status'}
        >
            <div className="toast-icon">
                <Icon size={19} strokeWidth={2} />
            </div>

            <div className="toast-content">
                {title && (
                    <strong className="toast-title">
                        {title}
                    </strong>
                )}

                {message && (
                    <p className="toast-message">
                        {message}
                    </p>
                )}
            </div>

            <button
                type="button"
                className="toast-close"
                onClick={() => onRemove(id)}
                aria-label="Fechar notificação"
            >
                <X size={16} strokeWidth={2} />
            </button>
        </div>
    )
}