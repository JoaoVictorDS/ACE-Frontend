import './ActivityItem.css'

export const ActivityItem = ({ avatar, user, action, description, time }) => {
    return (
        <div className="activity-item">
            <div className="activity-avatar">
                {avatar}
            </div>

            <div className="activity-info">
                <p>
                    <strong>{user}</strong> {action}
                </p>

                <span>
                    {description} · {time}
                </span>
            </div>
        </div>
    )
}
