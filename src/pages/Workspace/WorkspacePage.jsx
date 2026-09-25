import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Building2, CirclePlus, MoreHorizontal, RefreshCw, Users } from 'lucide-react'
import { useWorkspace } from '../../hooks/useWorkspaces'
import { getErrorMessage } from '../../utils/error'
import { Button } from '../../components/Button/Button'
import { FeedbackState } from '../../components/FeedbackState/FeedbackState'
import { Section } from '../../components/Section/Section'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { BoardCard } from '../../components/BoardCard/BoardCard'
import { MemberItem } from '../../components/MemberItem/MemberItem'
import { ActivityItem } from '../../components/ActivityItem/ActivityItem'
import './WorkspacePage.css'

export const WorkspacePage = () => {
    const { workspaceId } = useParams()
    const navigate = useNavigate()

    const { data: workspace, isLoading: workspaceLoading, error: workspaceError, refetch: refetchWorkspace } = useWorkspace(workspaceId)

    const workspaceBoards = workspace?.boards ?? []
    const workspaceMembers = workspace?.workspace_members ?? []
    const workspaceActivities = workspace?.activities ?? []

    // TODO: Adicionar mutations:
    // - updateWorkspace
    // - deleteWorkspace
    // - createBoard
    // - etc.

    if (workspaceLoading) {
        return <LoadingScreen />
    }

    if (workspaceError) {
        return (
            <div className="workspace-page-feedback">
                <FeedbackState
                    icon={<AlertCircle size={22} strokeWidth={2} />}
                    title="Não foi possível carregar o workspace"
                    message={getErrorMessage(workspaceError)}
                    action={
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => refetchWorkspace()}
                        >
                            <RefreshCw size={16} />
                            Tentar novamente
                        </Button>
                    }
                />
            </div>
        )
    }

    const handleBoardClick = (board) => {
        navigate(`/workspaces/${workspaceId}/boards/${board.id}`)
    }

    const renderWorkspaceBoards = () => {
        if (workspaceBoards.length === 0) return (
            <FeedbackState
                icon={<Building2 size={22} strokeWidth={2} />}
                title="Nenhum board encontrado"
                message="Este workspace ainda não possui nenhum board."
            />
        )

        return workspaceBoards.map((board) => (
            <BoardCard
                key={board.id}
                board={board}
                onClick={handleBoardClick}
            />
        ))
    }

    const renderWorkspaceMembers = () => {
        if (workspaceMembers.length === 0) return (
            <div className="workspace-inline-empty">
                <Users size={20} strokeWidth={2} />
                <span>
                    Este workspace ainda não possui membros.
                </span>
            </div>
        )

        return workspaceMembers.map((member) => (
            <MemberItem
                key={member.id}
                member={member}
            />
        ))
    }

    const renderWorkspaceActivities = () => {
        if (workspaceActivities.length === 0) return (
            <div className="workspace-inline-empty">
                < span >
                    Este workspace não possui atividades recentes.
                </span >
            </div >
        )

        return workspaceActivities.map((activity) => (
            <ActivityItem
                key={activity.id}
                user={activity.actor.name}
                action={activity.action}
                time={activity.created_at}
                description={activity.entity.type}
            />
        ))
    }

    return (
        <div className="workspace-container">
            <div className="workspace-content">

                {/* =========================
                    Workspace Header
                ========================= */}

                <header className="workspace-header">
                    <div className="workspace-header-main">
                        <div className="workspace-header-icon">
                            <Building2 size={28} strokeWidth={2} />
                        </div>
                        <div className="workspace-header-info">
                            <div className="workspace-header-title-row">
                                <h1>{workspace.name}</h1>
                                <span className="workspace-role">
                                    {workspace.user_role}
                                </span>
                            </div>
                            <p className="workspace-description">
                                {workspace.description || 'Sem descrição'}
                            </p>
                        </div>
                    </div>
                    <div className="workspace-header-actions">
                        {/* TODO: Exibir conforme permissão */}
                        {/* TODO: Implementar edição do workspace */}
                        <Button
                            variant="secondary"
                            type="button"
                        >
                            Editar workspace
                        </Button>

                        {/* TODO: Implementar menu de ações */}
                        <button
                            type="button"
                            className="workspace-more-button"
                            aria-label="Mais opções"
                        >
                            <MoreHorizontal
                                size={20}
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                </header>

                {/* =========================
                    Boards
                ========================= */}

                <Section
                    title="Boards"
                    description="Boards e projetos deste workspace."
                    action={
                        <Button
                            variant="primary"
                            type="button"
                        >
                            {/* TODO: Abrir modal de criação de board */}
                            <CirclePlus size={17} />
                            Novo board
                        </Button>
                    }
                    className="workspace-section"
                >
                    <div className="workspace-boards-grid">
                        {renderWorkspaceBoards()}
                    </div>
                </Section>

                {/* =========================
                    Members + Activity
                ========================= */}

                <div className="workspace-secondary-grid">
                    <Section
                        title="Membros"
                        description="Pessoas com acesso a este workspace."
                        action={
                            <button
                                type="button"
                                className="workspace-icon-button"
                                aria-label="Gerenciar membros"
                            >
                                {/* TODO: Abrir gerenciamento de membros */}
                                <Users size={18} strokeWidth={2} />
                            </button>
                        }
                        className="workspace-section"
                    >
                        <div className="workspace-members-list">
                            {renderWorkspaceMembers()}
                        </div>
                    </Section>

                    <Section
                        title="Atividade recente"
                        description="Últimas ações realizadas neste workspace."
                        action={
                            <button
                                type="button"
                                className="workspace-view-all-button"
                            >
                                {/* TODO: Navegar para página completa de logs */}
                                Ver todas
                                <ArrowRight
                                    size={15}
                                    strokeWidth={2}
                                />
                            </button>
                        }
                        className="workspace-section"
                    >
                        <div className="workspace-activity-list">
                            {renderWorkspaceActivities()}
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    )
}