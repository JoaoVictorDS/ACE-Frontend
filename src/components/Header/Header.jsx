import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

export const Header = () => {
    const { user, logout } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const userMenuRef = useRef(null)

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

    return (
        <header className="app-header">
            <div className="app-header-content">
                <Link to="/dashboard" className="app-header-logo">
                    ACE
                </Link>

                <div className="app-header-actions">
                    <div className="app-header-user-menu" ref={userMenuRef}>
                        <button
                            type="button"
                            className="app-header-user-button"
                            onClick={() => setShowUserMenu((current) => !current)}
                        >
                            <span className="app-header-user">
                                {user?.name}
                            </span>
                            <span className="app-header-user-arrow">
                                ▾
                            </span>
                        </button>

                        {showUserMenu && (
                            <div className="app-header-dropdown">
                                <button type="button" onClick={logout}>
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
