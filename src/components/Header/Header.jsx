import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../hooks/useUser'
import './Header.css'

export const Header = () => {
    const { logout } = useAuth()
    const { data: user } = useUser()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const userMenuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <header className="app-header">
            <div className="app-header-content">
                <Link to="/dashboard" className="app-header-logo">
                    ACE
                </Link>

                <div className="app-header-actions">
                    <button type="button" className="app-header-notification-button" aria-label="Notificações">
                        <span className="app-header-notification-icon">
                            ♢
                        </span>
                        <span className="app-header-notification-badge">
                            3 {/* Quantidade de notificação não lidas */}
                        </span>
                    </button>

                    <div className="app-header-user-menu" ref={userMenuRef}>
                        <button type="button" className="app-header-user-button" onClick={() =>
                            setShowUserMenu((current) => !current)
                        }>
                            <span className="app-header-user-avatar">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>

                            <span className="app-header-user-info">
                                <strong>
                                    {user?.name || 'Usuário'}
                                </strong>
                                <span>
                                    {user?.email || ''}
                                </span>
                            </span>

                            <span className="app-header-user-arrow">
                                ▾
                            </span>
                        </button>

                        {showUserMenu && (
                            <div className="app-header-dropdown">
                                <div className="app-header-dropdown-user">
                                    <div className="app-header-dropdown-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="app-header-dropdown-user-info">
                                        <strong>
                                            {user?.name || 'Usuário'}
                                        </strong>
                                        <span>
                                            {user?.email || ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="app-header-dropdown-divider" />

                                <Link to="/profile" className="app-header-dropdown-item">
                                    Perfil
                                </Link>

                                <button type="button" className="app-header-dropdown-logout" onClick={logout}>
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
