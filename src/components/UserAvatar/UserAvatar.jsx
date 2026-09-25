import './UserAvatar.css'

export const UserAvatar = ({ user, size = 'md' }) => {
    const name = user?.name || 'Usuário'
    const initials = name.charAt(0).toUpperCase()
    const className = `user-avatar user-avatar--${size}`

    return (
        <div
            className={className}
            title={name}
            aria-label={`Usuário: ${name}`}
        >
            {initials}
        </div>
    )
}