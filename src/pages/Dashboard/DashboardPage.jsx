import { useUser } from '../../hooks/useUser'
import { Button } from '../../components/Button/Button'
import { DashboardSection } from '../../components/DashboardSection/DashboardSection'
import { DashboardSummaryCard } from '../../components/DashboardSummaryCard/DashboardSummaryCard'
import { BoardCard } from '../../components/BoardCard/BoardCard'
import { TaskItem } from '../../components/TaskItem/TaskItem'
import { ActivityItem } from '../../components/ActivityItem/ActivityItem'
import './DashboardPage.css'

export const DashboardPage = () => {
    const { data: user } = useUser()

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
                            Acompanhe seus projetos e atividades.
                        </p>
                    </div>
                </header>

                <DashboardSection>
                    <div className="dashboard-summary-grid">
                        {/* TODO: Substituir pelos dados da API */}

                        <DashboardSummaryCard
                            icon="▦"
                            label="Boards"
                            value="5"
                            color="blue"
                        />

                        <DashboardSummaryCard
                            icon="✓"
                            label="Tarefas pendentes"
                            value="12"
                            color="purple"
                        />

                        <DashboardSummaryCard
                            icon="!"
                            label="Tarefas atrasadas"
                            value="3"
                            color="red"
                        />

                        <DashboardSummaryCard
                            icon="◉"
                            label="Concluídas"
                            value="27"
                            color="green"
                        />
                    </div>
                </DashboardSection>

                <DashboardSection
                    title="Meus boards"
                    description="Seus projetos e áreas de trabalho."
                    action={
                        <Button variant="primary">
                            + Novo Board
                        </Button>
                    }
                >
                    <div className="boards-grid">
                        {/* TODO: Buscar boards do workspace através da API */}

                        <BoardCard
                            color="blue"
                            title="Desenvolvimento"
                            description="Desenvolvimento e evolução do produto."
                            tasks={12}
                            pending={3}
                        />

                        <BoardCard
                            color="purple"
                            title="Marketing"
                            description="Campanhas e estratégias de marketing."
                            tasks={8}
                            pending={2}
                        />

                        <BoardCard
                            color="green"
                            title="Projetos"
                            description="Acompanhamento dos projetos da empresa."
                            tasks={15}
                            pending={5}
                        />
                    </div>
                </DashboardSection>

                <div className="dashboard-columns">
                    <DashboardSection
                        title="Minhas tarefas"
                        description="Tarefas atribuídas a você."
                        action={
                            <button className="section-link">
                                Ver todas
                            </button>
                        }
                        className="dashboard-column"
                    >
                        <div className="tasks-list">
                            {/* TODO: Buscar tarefas atribuídas ao usuário através da API */}

                            <TaskItem
                                status="pending"
                                title="Implementar autenticação"
                                board="Desenvolvimento"
                                date="Hoje"
                                dateClassName="today"
                            />

                            <TaskItem
                                status="warning"
                                title="Criar página inicial"
                                board="Design"
                                date="Amanhã"
                            />

                            <TaskItem
                                status="completed"
                                title="Configurar ambiente"
                                board="Desenvolvimento"
                                date="Concluída"
                            />

                            <TaskItem
                                status="overdue"
                                title="Revisar documentação"
                                board="Projetos"
                                date="Atrasada"
                                dateClassName="overdue-text"
                            />
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Atividade recente"
                        description="Últimas ações no workspace."
                        action={
                            <button className="section-link">
                                Ver todas
                            </button>
                        }
                        className="dashboard-column"
                    >
                        <div className="activity-list">
                            {/* TODO: Buscar atividades recentes através da API */}

                            <ActivityItem
                                avatar="M"
                                user="Maria"
                                action="criou uma nova tarefa"
                                description="Implementar dashboard"
                                time="há 10 min"
                            />

                            <ActivityItem
                                avatar="J"
                                user="João"
                                action="concluiu uma tarefa"
                                description="Configurar autenticação"
                                time="há 32 min"
                            />

                            <ActivityItem
                                avatar="P"
                                user="Pedro"
                                action="atualizou o status de uma tarefa"
                                description="Deploy da aplicação"
                                time="há 1 hora"
                            />

                            <ActivityItem
                                avatar="A"
                                user="Ana"
                                action="criou um novo board"
                                description="Marketing"
                                time="há 2 horas"
                            />
                        </div>
                    </DashboardSection>
                </div>
            </div>
        </div>
    )
}
