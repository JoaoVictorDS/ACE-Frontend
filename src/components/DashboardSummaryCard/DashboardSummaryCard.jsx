import './DashboardSummaryCard.css'

export const DashboardSummaryCard = ({ icon, label, value, color = 'blue' }) => {
    return (
        <article className={`summary-card summary-card--${color}`}>
            <div className="summary-card-icon">
                {icon}
            </div>

            <div className="summary-card-content">
                <span className="summary-card-label">
                    {label}
                </span>

                <strong className="summary-card-value">
                    {value}
                </strong>
            </div>
        </article>
    )
}