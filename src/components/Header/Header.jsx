import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../hooks/useUser'
import { NotificationButton } from '../../components/Notifications/NotificationButton'
import { UserAvailabilityMenu } from '../../components/UserAvailabilityMenu/UserAvailabilityMenu'
import { getUserAvailabilityOption, USER_AVAILABILITY } from '../../constants/userAvailability'
import './Header.css'

export const Header = () => {
    const { logout } = useAuth()
    const { data: user } = useUser()
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Temporário: será substituído pelo backend
    const [availability, setAvailability] = useState(USER_AVAILABILITY.AVAILABLE)

    const userMenuRef = useRef(null)
    const currentAvailability = getUserAvailabilityOption(availability)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleAvailabilityChange = (value) => {
        setAvailability(value)
    }

    const handleProfileClick = () => {
        setShowUserMenu(false)
    }

    return (
        <header className="app-header">
            <div className="app-header-content">
                <Link
                    to="/dashboard"
                    className="app-header-logo"
                >
                    ACE
                </Link>

                <div className="app-header-actions">
                    <NotificationButton />

                    <div
                        className="app-header-user-menu"
                        ref={userMenuRef}
                    >
                        <button
                            type="button"
                            className="app-header-user-button"
                            onClick={() => setShowUserMenu((current) => !current)}
                            aria-expanded={showUserMenu}
                            aria-haspopup="menu"
                        >
                            <span className="app-header-user-avatar">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>

                            <span className="app-header-user-info">
                                <strong>
                                    {user?.name || 'Usuário'}
                                </strong>

                                <span className="app-header-user-availability">
                                    <span
                                        className={`app-header-user-availability-dot availability-${availability.toLowerCase()}`}
                                    />

                                    {currentAvailability.label}
                                </span>
                            </span>

                            <span className="app-header-user-arrow">
                                ▾
                            </span>
                        </button>

                        {showUserMenu && (
                            <div
                                className="app-header-dropdown"
                                role="menu"
                            >
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

                                <UserAvailabilityMenu
                                    value={availability}
                                    onChange={handleAvailabilityChange}
                                />

                                <div className="app-header-dropdown-divider" />

                                <Link
                                    to="/profile"
                                    className="app-header-dropdown-item"
                                    onClick={handleProfileClick}
                                >
                                    Perfil
                                </Link>

                                <button
                                    type="button"
                                    className="app-header-dropdown-logout"
                                    onClick={logout}
                                >
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
