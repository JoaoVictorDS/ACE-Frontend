import './ProfileUserSummary.css'

export const ProfileUserSummary = ({ user }) => {
    const initial =
        user?.name?.charAt(0).toUpperCase() || 'U'

    return (
        <div className="profile-user-summary">
            <div className="profile-user-avatar">
                {initial}
            </div>

            <div className="profile-user-summary-info">
                <strong>
                    {user?.name || 'Usuário'}
                </strong>

                <span>
                    {user?.email || ''}
                </span>

                {user?.role && (
                    <span className="profile-role">
                        {user.role}
                    </span>
                )}
            </div>
        </div>
    )
}
