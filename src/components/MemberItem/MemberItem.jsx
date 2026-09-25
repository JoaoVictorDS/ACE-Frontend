import { UserAvatar } from '../UserAvatar/UserAvatar'
import './MemberItem.css'

export const MemberItem = ({ member }) => {
    const { user, role } = member

    return (
        <article className="member-item">
            <UserAvatar user={user} />
            <div className="member-info">
                <strong className="member-name">
                    {user?.name || 'Usuário'}
                </strong>

                <span className="member-email">
                    {user?.email || 'Sem e-mail'}
                </span>
            </div>
            <span className="member-role">
                {role}
            </span>
        </article>
    )
}