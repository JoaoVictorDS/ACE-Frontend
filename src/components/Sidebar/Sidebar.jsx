import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useWorkspaces } from '../../hooks/useWorkspaces'
import { useBoards } from '../../hooks/useBoards'
import { LoadingState } from '../LoadingState/LoadingState'
import './Sidebar.css'

export const Sidebar = ({ onCreateWorkspace }) => {
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const { workspaceId, boardId } = useParams()

    const { data: workspaces = [], isLoading: workspacesLoading } = useWorkspaces()
    const { data: workspaceBoards = [], isLoading: workspaceBoardsLoading } = useBoards(workspaceId)

    const selectedWorkspace = workspaces.find((workspace) => String(workspace.id) === String(workspaceId))

    const isActive = (path) => {
        return location.pathname === path
    }

    const handleSelectWorkspace = (id) => {
        setShowWorkspaceMenu(false)

        navigate(`/workspaces/${id}`)
    }

    const handleSelectBoard = () => {
        setShowWorkspaceMenu(false)
    }

    const renderWorkspaces = () => {
        if (workspacesLoading) return (
            <LoadingState message="Carregando workspaces" />
        )

        if (workspaces?.length === 0) return (
            <div className="app-sidebar-workspace-empty">
                Nenhum workspace
            </div>
        )

        return workspaces?.map((workspace) => (
            <button
                key={workspace.id}
                type="button"
                className={`app-sidebar-workspace-option ${String(workspace.id) === String(workspaceId) ? 'active' : ''} `}
                onClick={() => handleSelectWorkspace(workspace.id)}
            >
                <span className="app-sidebar-workspace-option-avatar">
                    {workspace.name?.charAt(0).toUpperCase()}
                </span>
                <span>
                    {workspace.name}
                </span>
            </button>
        ))
    }

    const renderWorkspaceBoards = () => {
        if (workspaceBoardsLoading) return (
            <LoadingState message="Carregando boards" />
        )

        if (workspaceBoards?.length === 0) return (
            <div className="app-sidebar-boards-empty">
                Nenhum board
            </div>
        )

        return workspaceBoards?.map((board) => (
            <Link
                key={board.id}
                to={`/workspaces/${workspaceId}/boards/${board.id}`}
                onClick={handleSelectBoard}
                className={`app-sidebar-board ${String(board.id) === String(boardId) ? 'active' : ''}`}
            >
                <span
                    className="app-sidebar-board-icon"
                    style={{ color: board.color }}
                >
                    ▦
                </span>
                <span>
                    {board.name}
                </span>
            </Link>
        ))
    }

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-content">
                <div className="app-sidebar-workspace">
                    <button
                        type="button"
                        className="app-sidebar-workspace-button"
                        onClick={() => setShowWorkspaceMenu((current) => !current)}>
                        <span className="app-sidebar-workspace-avatar">
                            {selectedWorkspace?.name?.charAt(0).toUpperCase() || 'W'}
                        </span>
                        <span className="app-sidebar-workspace-info">
                            <span className="app-sidebar-workspace-label">
                                Workspace
                            </span>

                            <strong>
                                {selectedWorkspace?.name || 'Selecionar workspace'}
                            </strong>
                        </span>

                        <span className="app-sidebar-workspace-arrow">
                            ▾
                        </span>
                    </button>

                    {showWorkspaceMenu && (
                        <div className="app-sidebar-workspace-menu">
                            {renderWorkspaces()}
                            <div className="app-sidebar-workspace-divider" />
                            <button
                                type="button"
                                className="app-sidebar-new-workspace"
                                onClick={() => {
                                    setShowWorkspaceMenu(false)
                                    onCreateWorkspace()
                                }}
                            >
                                + Novo Workspace
                            </button>
                        </div>
                    )}
                </div>

                <nav className="app-sidebar-navigation">
                    <Link
                        to="/dashboard"
                        className={`app-sidebar-link ${isActive('/dashboard') ? 'active' : ''} `}
                    >
                        <span className="app-sidebar-link-icon">
                            ⌂
                        </span>

                        <span>Dashboard</span>
                    </Link>

                    {selectedWorkspace && (
                        <>
                            <Link
                                to={`/workspaces/${workspaceId}`}
                                className={`app-sidebar-link ${isActive(`/workspaces/${workspaceId}`) ? 'active' : ''} `}
                            >
                                <span className="app-sidebar-link-icon">
                                    ▦
                                </span>
                                <span>Visão geral</span>
                            </Link>
                            <div className="app-sidebar-boards">
                                <div className="app-sidebar-boards-header">
                                    <span>Boards</span>
                                    <button
                                        type="button"
                                        title="Novo board"
                                    >
                                        +
                                    </button>
                                </div>
                                {renderWorkspaceBoards()}
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </aside>
    )
}