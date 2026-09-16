import { NavLink, Outlet } from 'react-router-dom'
import './ProfilePage.css'

const tabs = [
    {
        id: 'profile',
        label: 'Perfil',
        path: '/profile',
    },
    {
        id: 'notifications',
        label: 'Notificações',
        path: '/profile/notifications',
    },
    {
        id: 'security',
        label: 'Segurança',
        path: '/profile/security',
    },
    {
        id: 'account',
        label: 'Conta',
        path: '/profile/account',
    },
]

export const ProfilePage = () => {
    return (
        <div className="profile-container">
            <div className="profile-content">

                {/* =========================
                    Header
                ========================= */}

                <header className="profile-header">
                    <div>
                        <span className="profile-greeting">
                            Minha conta
                        </span>

                        <h2>Perfil</h2>

                        <p>
                            Gerencie suas informações pessoais,
                            preferências, notificações e segurança.
                        </p>
                    </div>
                </header>

                {/* =========================
                    Tabs
                ========================= */}

                <nav
                    className="profile-tabs"
                    aria-label="Configurações do perfil"
                >
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.id}
                            to={tab.path}
                            end={tab.id === 'profile'}
                            className={({ isActive }) =>
                                `profile-tab ${isActive
                                    ? 'profile-tab-active'
                                    : ''
                                }`
                            }
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>

                {/* =========================
                    Tab Content
                ========================= */}

                <main className="profile-tab-content">
                    <Outlet />
                </main>

            </div>
        </div>
    )
}