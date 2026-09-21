import './FeedbackState.css'

export const FeedbackState = ({ icon, title, message, action }) => {
    return (
        <div className="feedback-state">
            {icon && (
                <div className="feedback-state-icon">
                    {icon}
                </div>
            )}

            <h3 className="feedback-state-title">
                {title}
            </h3>

            {message && (
                <p className="feedback-state-message">
                    {message}
                </p>
            )}

            {action && (
                <div className="feedback-state-action">
                    {action}
                </div>
            )}
        </div>
    )
}