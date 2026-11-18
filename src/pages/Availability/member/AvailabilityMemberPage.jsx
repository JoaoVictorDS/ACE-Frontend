
import { useState } from 'react'
import { AlertCircle, CalendarClock, RefreshCcw, Search, Users } from 'lucide-react'
import { useAvailability } from '../../../hooks/useAvailability'
import { Button } from '../../../components/Button/Button'
import { FeedbackState } from '../../../components/FeedbackState/FeedbackState'
import { LoadingState } from '../../../components/LoadingState/LoadingState'
import { getUserAvailabilityOption } from '../../../constants/userAvailability'
import { getErrorMessage } from '../../../utils/error'

export const AvailabilityMemberPage = () => {
    const [search, setSearch] = useState('')

    const { data: users = [], isLoading: usersLoading, isError: usersError, error, refetch: refetchUsers } = useAvailability()

    const filteredUsers = users.filter((user) => user.name?.toLowerCase().includes(search.trim().toLowerCase()))

    const renderUserStatus = (user) => {
        const availability = getUserAvailabilityOption(user.status)
        const statusClass = user.status?.toLowerCase() ?? 'none'

        return (
            <span className={`availability-page-status availability-${statusClass}`}>
                <span className="availability-page-status-dot" />
                {availability.label}
            </span>
        )
    }

    return (
        <div className="availability-page availability-member-page">
            <div className="availability-page-header">
                <div className="availability-page-heading">
                    <span className="availability-page-header-icon">
                        <CalendarClock size={22} />
                    </span>

                    <div>
                        <h1>Disponibilidade</h1>
                        <p>
                            Acompanhe a disponibilidade atual dos usuários.
                        </p>
                    </div>
                </div>

                <div className="availability-page-total">
                    <Users size={16} />
                    <span>
                        {users.length} {users.length === 1 ? 'usuário ativo' : 'usuários ativos'}
                    </span>
                </div>
            </div>

            <section className="availability-page-users">
                <div className="availability-page-section-header">
                    <div>
                        <h2>Equipe</h2>
                        <p>Consulte o status atual de cada usuário.</p>
                    </div>
                </div>

                <div className="availability-page-search">
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Pesquisar usuário..."
                        aria-label="Pesquisar usuários"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                {usersLoading ? (
                    <LoadingState message="Carregando usuários" />
                ) : usersError ? (
                    <FeedbackState
                        icon={<AlertCircle size={22} strokeWidth={2} />}
                        title="Não foi possível carregar os usuários"
                        message={getErrorMessage(error)}
                        action={
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => refetchUsers()}
                            >
                                <RefreshCcw size={16} />
                                Tentar novamente
                            </Button>
                        }
                    />
                ) : filteredUsers.length === 0 ? (
                    <div className="availability-page-feedback">
                        {users.length === 0
                            ? 'Nenhum usuário ativo encontrado.'
                            : 'Nenhum usuário corresponde à pesquisa.'}
                    </div>
                ) : (
                    <div className="availability-page-user-list">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="availability-page-user"
                            >
                                <span className="availability-page-user-avatar">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </span>

                                <span className="availability-page-user-info">
                                    <strong>{user.name}</strong>

                                    {renderUserStatus(user)}

                                    <span className="availability-page-user-time">
                                        {user.changed_time
                                            ? `Alterado às ${user.changed_time}`
                                            : 'Sem alteração registrada hoje'}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
