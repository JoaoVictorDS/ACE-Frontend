import { useEffect, useId, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import './ConfirmDialog.css'

export const ConfirmDialog = ({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'danger', icon, isPending = false, onConfirm, onCancel }) => {
    const dialogRef = useRef(null)
    const titleId = useId()
    const descriptionId = useId()

    useEffect(() => {
        const dialog = dialogRef.current

        if (!dialog) {
            return
        }

        if (!dialog.open) {
            dialog.showModal()
        }

        return () => {
            if (dialog.open) {
                dialog.close()
            }
        }
    }, [])

    const handleCancel = () => {
        if (!isPending) {
            onCancel()
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className={`confirm-dialog confirm-dialog-${variant}`}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onCancel={(event) => {
                event.preventDefault()
                handleCancel()
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    handleCancel()
                }
            }}
        >
            <div className="confirm-dialog-content">
                <div className="confirm-dialog-body">
                    <span className="confirm-dialog-icon">
                        {icon ?? <AlertTriangle size={22} strokeWidth={1.9} />}
                    </span>

                    <div className="confirm-dialog-text">
                        <h2 id={titleId}>
                            {title}
                        </h2>

                        <p id={descriptionId}>
                            {message}
                        </p>
                    </div>
                </div>

                <footer className="confirm-dialog-footer">
                    <button
                        type="button"
                        className="confirm-dialog-cancel"
                        onClick={handleCancel}
                        disabled={isPending}
                        autoFocus
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        className="confirm-dialog-confirm"
                        onClick={onConfirm}
                        disabled={isPending}
                    >
                        {isPending ? 'Processando...' : confirmLabel}
                    </button>
                </footer>
            </div>
        </dialog>
    )
}