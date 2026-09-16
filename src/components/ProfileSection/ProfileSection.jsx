import './ProfileSection.css'

export const ProfileSection = ({
    title,
    description,
    children,
}) => {
    return (
        <section className="profile-section">
            <div className="profile-section-header">
                <div>
                    <h3>{title}</h3>

                    {description && (
                        <p>{description}</p>
                    )}
                </div>
            </div>

            {children}
        </section>
    )
}
