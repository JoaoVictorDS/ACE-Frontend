import './FormFeedback.css'

export const FormFeedback = ({ type = 'error', icon, children }) => {
    const defaultIcons = {
        error: '!',
        success: '✓',
    }

    return (
        <div
            className={`form-feedback form-feedback-${type}`}
            role={type === 'error' ? 'alert' : 'status'}
        >
            <span className="form-feedback-icon">
                {icon ?? defaultIcons[type]}
            </span>

            <span className="form-feedback-message">
                {children}
            </span>
        </div>
    )
}
