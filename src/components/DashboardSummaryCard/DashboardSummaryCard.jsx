export const DashboardSummaryCard = ({
    icon,
    label,
    value,
    color,
}) => {
    return (
        <div className="summary-card">
            <div className={`summary-card-icon ${color}`}>
                {icon}
            </div>

            <div>
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
        </div>
    )
}
