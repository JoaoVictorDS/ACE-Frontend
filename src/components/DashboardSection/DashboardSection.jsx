import './DashboardSection.css'

export const DashboardSection = ({ title, description, action, children, className = '' }) => {
    return (
        <section className={`dashboard-section ${className}`}>
            <div className="section-header">
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>

                {action && (
                    <div className="section-action">
                        {action}
                    </div>
                )}
            </div>

            {children}
        </section>
    )
}
