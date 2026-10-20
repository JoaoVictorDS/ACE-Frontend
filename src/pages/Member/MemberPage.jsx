import { NavLink, Outlet } from 'react-router-dom'
import './MemberPage.css'

const tabs = [
    { id: 'user', label: 'Usuários do sistema', path: '/members' },
    { id: 'workspace', label: 'Workspaces', path: '/members/workspaces' },
    { id: 'board', label: 'Boards', path: '/members/boards' },
]

export const MemberPage = () => {
    return (
        <div className="member-container">
            <div className="member-content">
                <header className="member-header">
                    <div>
                        <span className="member-greeting">
                            Administração
                        </span>

                        <h2>Membros</h2>

                        <p>
                            Gerencie os usuários do sistema e os membros dos
                            workspaces e boards.
                        </p>
                    </div>
                </header>

                <nav className="member-tabs" aria-label="Gerenciamento de membros">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.id}
                            to={tab.path}
                            end={tab.id === 'user'}
                            className={({ isActive }) =>
                                `member-tab ${isActive ? 'member-tab-active' : ''}`
                            }
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>

                <main className="member-tab-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}