import { useNavigate, useOutletContext } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { useWorkspaces } from '../../hooks/useWorkspaces'
import { Button } from '../../components/Button/Button'
import { Section } from '../../components/Section/Section'
import { DashboardSummaryCard } from '../../components/DashboardSummaryCard/DashboardSummaryCard'
import { WorkspaceCard } from '../../components/WorkspaceCard/WorkspaceCard'
import { FeedbackState } from '../../components/FeedbackState/FeedbackState'
import { AlertCircle, Building2, CircleCheck, ListTodo, Plus, RefreshCw, TriangleAlert } from 'lucide-react'
import './DashboardPage.css'

export const DashboardPage = () => {
    const navigate = useNavigate()
    const { openCreateWorkspaceModal } = useOutletContext()

    const { data: user } = useUser()
    const { data: workspaces = [], isLoading: workspacesLoading, isError: workspacesError, refetch: refetchWorkspaces } = useWorkspaces()

    const handleWorkspaceClick = (workspace) => {
        navigate(`/workspaces/${workspace.id}`)
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <span className="dashboard-greeting">
                            Olá, {user?.name || 'usuário'} 👋
                        </span>
                        <h2>Visão geral</h2>
                        <p>
                            Acompanhe seus workspaces, tarefas e atividades.
                        </p>
                    </div>
                </header>

                <Section>
                    <div className="dashboard-summary-grid">
                        {/* TODO: Substituir pelos dados da API */}

                        <DashboardSummaryCard
                            icon={<Building2 size={20} strokeWidth={2} />}
                            label="Workspaces"
                            value={workspaces.length}
                            color="blue"
                        />

                        <DashboardSummaryCard
                            icon={<ListTodo size={20} strokeWidth={2} />}
                            label="Tarefas pendentes"
                            value="-"
                            color="purple"
                        />

                        <DashboardSummaryCard
                            icon={<TriangleAlert size={20} strokeWidth={2} />}
                            label="Tarefas atrasadas"
                            value="-"
                            color="red"
                        />

                        <DashboardSummaryCard
                            icon={<CircleCheck size={20} strokeWidth={2} />}
                            label="Concluídas"
                            value="-"
                            color="green"
                        />
                    </div>
                </Section>

                <Section
                    title="Meus workspaces"
                    description="Workspaces dos quais você faz parte."
                    action={
                        <Button
                            variant="primary"
                            type="button"
                            onClick={openCreateWorkspaceModal}
                        >
                            <Plus size={17} />
                            Novo Workspace
                        </Button>
                    }
                >
                    <div className="workspaces-grid">
                        {workspacesLoading && (
                            <FeedbackState
                                icon={
                                    <Building2
                                        size={22}
                                        strokeWidth={2}
                                    />
                                }
                                title="Carregando workspaces"
                                message="Buscando os workspaces dos quais você faz parte."
                            />
                        )}

                        {workspacesError && (
                            <FeedbackState
                                icon={
                                    <AlertCircle
                                        size={22}
                                        strokeWidth={2}
                                    />
                                }
                                title="Não foi possível carregar os workspaces"
                                message="Ocorreu um erro ao buscar seus workspaces. Tente novamente."
                                action={
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => refetchWorkspaces()}
                                    >
                                        <RefreshCw size={16} />
                                        Tentar novamente
                                    </Button>
                                }
                            />
                        )}

                        {!workspacesLoading &&
                            !workspacesError &&
                            workspaces.length === 0 && (
                                <FeedbackState
                                    icon={
                                        <Building2
                                            size={22}
                                            strokeWidth={2}
                                        />
                                    }
                                    title="Nenhum workspace encontrado"
                                    message="Você ainda não participa de nenhum workspace."
                                    action={
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={openCreateWorkspaceModal}
                                        >
                                            <Plus size={17} />
                                            Criar workspace
                                        </Button>
                                    }
                                />
                            )}

                        {!workspacesLoading &&
                            !workspacesError &&
                            workspaces.map((workspace) => (
                                <WorkspaceCard
                                    key={workspace.id}
                                    workspace={workspace}
                                    onClick={handleWorkspaceClick}
                                />
                            ))}
                    </div>
                </Section>
            </div>
        </div>
    )
}
