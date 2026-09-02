import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWorkspaces } from '../../hooks/useWorkspaces'
import { useAuth } from '../../hooks/useAuth'
import './Sidebar.css'

export const Sidebar = () => {
    const { user, loading: authLoading } = useAuth()
    const { workspaces, loading, handleLoadWorkspaces, } = useWorkspaces()
    const location = useLocation()
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = useState(null)

    useEffect(() => {
        if (!authLoading && user) {
            handleLoadWorkspaces()
        }
    }, [authLoading, user, handleLoadWorkspaces])

    useEffect(() => {
        if (workspaces.length > 0 && !selectedWorkspace) {
            setSelectedWorkspace(workspaces[0])
        }
    }, [workspaces, selectedWorkspace])

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-content">
                <div className="app-sidebar-workspace">
                    <button
                        type="button"
                        className="app-sidebar-workspace-button"
                        onClick={() =>
                            setShowWorkspaceMenu((current) => !current)
                        }
                    >
                        <span className="app-sidebar-workspace-avatar">
                            {selectedWorkspace?.name
                                ?.charAt(0)
                                .toUpperCase() || 'W'}
                        </span>

                        <span className="app-sidebar-workspace-info">
                            <span className="app-sidebar-workspace-label">
                                Workspace
                            </span>

                            <strong>
                                {selectedWorkspace?.name ||
                                    'Selecionar workspace'}
                            </strong>
                        </span>

                        <span className="app-sidebar-workspace-arrow">
                            ▾
                        </span>
                    </button>

                    {showWorkspaceMenu && (
                        <div className="app-sidebar-workspace-menu">
                            {loading ? (
                                <div className="app-sidebar-workspace-loading">
                                    Carregando...
                                </div>
                            ) : workspaces.length === 0 ? (
                                <div className="app-sidebar-workspace-empty">
                                    Nenhum workspace
                                </div>
                            ) : (
                                workspaces.map((workspace) => (
                                    <button
                                        key={workspace.id}
                                        type="button"
                                        className="app-sidebar-workspace-option"
                                        onClick={() => {
                                            setSelectedWorkspace(workspace)
                                            setShowWorkspaceMenu(false)
                                        }}
                                    >
                                        <span className="app-sidebar-workspace-option-avatar">
                                            {workspace.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>

                                        <span>
                                            {workspace.name}
                                        </span>
                                    </button>
                                ))
                            )}

                            <div className="app-sidebar-workspace-divider" />

                            <button
                                type="button"
                                className="app-sidebar-new-workspace"
                            >
                                + Novo Workspace
                            </button>
                        </div>
                    )}
                </div>

                <nav className="app-sidebar-navigation">
                    <Link
                        to="/dashboard"
                        className={`app-sidebar-link ${isActive('/dashboard')
                            ? 'active'
                            : ''
                            }`}
                    >
                        <span className="app-sidebar-link-icon">
                            ⌂
                        </span>

                        <span>Dashboard</span>
                    </Link>

                    {selectedWorkspace && (
                        <Link
                            to={`/workspaces/${selectedWorkspace.id}/boards`}
                            className="app-sidebar-link"
                        >
                            <span className="app-sidebar-link-icon">
                                ▦
                            </span>

                            <span>Boards</span>
                        </Link>
                    )}
                </nav>
            </div>
        </aside>
    )
}
