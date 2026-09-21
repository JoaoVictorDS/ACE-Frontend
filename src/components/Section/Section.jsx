import './Section.css'

export const Section = ({ title, description, action, children, className = '' }) => {
    const hasHeader = title || description || action

    return (
        <section className={`section ${className}`}>
            {hasHeader && (
                <div className="section-header">
                    <div>
                        {title && <h3>{title}</h3>}
                        {description && <p>{description}</p>}
                    </div>

                    {action && (
                        <div className="section-action">
                            {action}
                        </div>
                    )}
                </div>
            )}

            {children}
        </section>
    )
}