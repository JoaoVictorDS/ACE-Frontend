import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../hooks/useUser'
import { NotificationButton } from '../../components/Notifications/NotificationButton'
import { UserAvailabilityMenu } from '../../components/UserAvailabilityMenu/UserAvailabilityMenu'
import { getUserAvailabilityOption } from '../../constants/userAvailability'
import { useAvailability, useUpdateAvailabilityStatus } from '../../hooks/useAvailability'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../utils/error'
import './Header.css'

export const Header = () => {
    const userMenuRef = useRef(null)

    const [showUserMenu, setShowUserMenu] = useState(false)

    const { logout } = useAuth()
    const { data: user } = useUser()
    const { data: availabilityUsers = [], isLoading: availabilityLoading, error: availabilityError } = useAvailability()
    const { updateAvailabilityStatus, updatingAvailabilityStatus } = useUpdateAvailabilityStatus()

    const { error } = useToast()

    const currentAvailabilityUser = availabilityUsers.find((availabilityUser) => availabilityUser.id === user?.id)
    const availability = currentAvailabilityUser?.status ?? null
    const currentAvailability = availabilityError
        ? { label: 'Erro ao carregar' }
        : availabilityLoading
            ? { label: 'Carregando...' }
            : getUserAvailabilityOption(availability)

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

    useEffect(() => {
        if (!availabilityError) return

        error({
            title: 'Erro ao carregar disponibilidade',
            message: getErrorMessage(availabilityError)
        })
    }, [availabilityError, error])

    const handleAvailabilityChange = async (value) => {
        if (updatingAvailabilityStatus || value === availability) return

        try {
            await updateAvailabilityStatus(value)
        } catch (err) {
            error({
                title: 'Erro ao atualizar disponibilidade',
                message: getErrorMessage(err)
            })
        }
    }

    const handleUserMenuNavigation = () => {
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
                                        className={`app-header-user-availability-dot availability-${availability?.toLowerCase() ?? 'none'}`}
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
                                    disabled={availabilityLoading || updatingAvailabilityStatus}
                                />

                                <div className="app-header-dropdown-divider" />

                                <Link
                                    to="/profile"
                                    className="app-header-dropdown-item"
                                    onClick={handleUserMenuNavigation}
                                >
                                    Perfil
                                </Link>

                                <Link
                                    to="/members"
                                    className="app-header-dropdown-item"
                                    onClick={handleUserMenuNavigation}
                                >
                                    Membros
                                </Link>

                                <Link
                                    to="/availability"
                                    className="app-header-dropdown-item"
                                    onClick={handleUserMenuNavigation}
                                >
                                    Disponibilidade
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
