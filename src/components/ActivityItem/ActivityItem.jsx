import './ActivityItem.css'

export const ActivityItem = ({ avatar, user, action, description, time }) => {
    const fallbackAvatar = user?.charAt(0)?.toUpperCase() || '?'

    return (
        <article className="activity-item">
            <div className="activity-avatar">
                {avatar || fallbackAvatar}
            </div>

            <div className="activity-info">
                <p className="activity-action">
                    <strong>{user}</strong>
                    <span>{action}</span>
                </p>

                <div className="activity-meta">
                    <span className="activity-description">
                        {description}
                    </span>

                    <span className="activity-separator">
                        ·
                    </span>

                    <span className="activity-time">
                        {time}
                    </span>
                </div>
            </div>
        </article>
    )
}
