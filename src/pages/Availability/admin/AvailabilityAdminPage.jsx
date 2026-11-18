import { useEffect, useState } from 'react'
import { AlertCircle, AlertTriangle, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, Clock3, FileText, RefreshCcw, Search, Users } from 'lucide-react'
import { useAvailability, useAvailabilityMonth, useUpdateUserAvailabilityStatus } from '../../../hooks/useAvailability'
import { UserAvailabilityMenu } from '../../../components/UserAvailabilityMenu/UserAvailabilityMenu'
import { AvailabilityDayEditor } from '../../../components/AvailabilityDayEditor/AvailabilityDayEditor'
import { Button } from '../../../components/Button/Button'
import { FeedbackState } from '../../../components/FeedbackState/FeedbackState'
import { getUserAvailabilityOption } from '../../../constants/userAvailability'
import { useToast } from '../../../hooks/useToast'
import { getErrorMessage } from '../../../utils/error'
import { LoadingState } from '../../../components/LoadingState/LoadingState'
import './AvailabilityAdminPage.css'

const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) {
        return 'Pendente de revisão'
    }

    const totalMinutes = Math.floor(seconds / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours === 0) return `${minutes}min`

    return `${hours}h ${String(minutes).padStart(2, '0')}min`
}

const formatDay = (value) => {
    const date = new Date(`${value}T00:00:00`)

    return {
        date: date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        }),
        weekday: date.toLocaleDateString('pt-BR', {
            weekday: 'short'
        })
    }
}

export const AvailabilityAdminPage = () => {
    const currentDate = new Date()

    const [search, setSearch] = useState('')
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [selectedWorkDate, setSelectedWorkDate] = useState(null)
    const [year, setYear] = useState(currentDate.getFullYear())
    const [month, setMonth] = useState(currentDate.getMonth() + 1)

    const { data: users = [], isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useAvailability()

    const filteredUsers = users.filter((user) => user.name?.toLowerCase().includes(search.trim().toLowerCase()))

    useEffect(() => {
        if (usersLoading) return

        const selectedUserExists = users.some((user) => user.id === selectedUserId)

        if (!selectedUserExists) {
            setSelectedUserId(users[0]?.id ?? null)
            setSelectedWorkDate(null)
        }
    }, [users, selectedUserId, usersLoading])

    const selectedUser = users.find((user) => user.id === selectedUserId) ?? null
    const selectedUserVisible = filteredUsers.some((user) => user.id === selectedUserId)

    const { data: monthData, isLoading: monthLoading, isError: monthError, refetch: refetchMonth } = useAvailabilityMonth({ userId: selectedUser?.id, year, month })
    const { updateUserAvailabilityStatus, updatingUserAvailabilityStatus } = useUpdateUserAvailabilityStatus()

    const { error } = useToast()

    const handleSelectUser = (userId) => {
        setSelectedUserId(userId)
        setSelectedWorkDate(null)
    }

    const handleToggleDay = (workDate) => {
        setSelectedWorkDate((current) => current === workDate ? null : workDate)
    }

    const handleMonthChange = (amount) => {
        const nextDate = new Date(year, month - 1 + amount, 1)

        setYear(nextDate.getFullYear())
        setMonth(nextDate.getMonth() + 1)
        setSelectedWorkDate(null)
    }

    const handleAvailabilityChange = async (status) => {
        if (!selectedUser || updatingUserAvailabilityStatus || status === selectedUser.status) {
            return
        }

        try {
            await updateUserAvailabilityStatus({
                userId: selectedUser.id,
                status
            })
        } catch (err) {
            error({
                title: 'Erro ao atualizar disponibilidade',
                message: getErrorMessage(err)
            })
        }
    }

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

    const renderPeriodTime = (period) => {
        const startedTime = period.started_time
        const endedTime = period.ended_time

        if (period.status === 'END_OF_DAY') {
            return startedTime
        }

        if (!endedTime) {
            return period.duration_seconds === null
                ? `${startedTime} — Sem encerramento`
                : `${startedTime} — Em andamento`
        }

        return `${startedTime} — ${endedTime}`
    }

    const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="availability-page availability-admin-page">
            <div className="availability-page-header">
                <div className="availability-page-heading">
                    <span className="availability-page-header-icon">
                        <CalendarClock size={22} />
                    </span>

                    <div>
                        <h1>Disponibilidade</h1>
                        <p>
                            Consulte e gerencie os horários dos usuários.
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

            <div className="availability-page-content">
                <section className="availability-page-users">
                    <div className="availability-page-section-header">
                        <div>
                            <h2>Equipe</h2>
                            <p>Selecione alguém para consultar.</p>
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

                    {selectedUser && search.trim() && !selectedUserVisible && (
                        <div className="availability-page-selected-user-notice">
                            <span>
                                Exibindo <strong>{selectedUser.name}</strong>,
                                que não corresponde à pesquisa.
                            </span>

                            <button
                                type="button"
                                onClick={() => setSearch('')}
                            >
                                Limpar pesquisa
                            </button>
                        </div>
                    )}

                    {usersLoading ? (
                        <LoadingState message="Carregando usuários" />
                    ) : usersError ? (
                        <FeedbackState
                            icon={<AlertCircle size={22} strokeWidth={2} />}
                            title="Não foi possível carregar os usuários"
                            message={getErrorMessage(usersError)}
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
                            {filteredUsers.map((user) => {
                                const isSelected = selectedUser?.id === user.id

                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className={`availability-page-user ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectUser(user.id)}
                                        aria-pressed={isSelected}
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
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </section>

                <section className="availability-page-details">
                    {!selectedUser ? (
                        <div className="availability-page-details-empty">
                            <Users size={30} />

                            <h2>Selecione um usuário</h2>

                            <p>
                                Escolha alguém na lista para consultar sua disponibilidade.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="availability-page-details-header">
                                <span className="availability-page-details-avatar">
                                    {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                                </span>

                                <div>
                                    <h2>{selectedUser.name}</h2>
                                    <p>Gerenciamento de disponibilidade</p>
                                </div>
                            </div>

                            <div className="availability-page-overview">
                                <section className="availability-page-current-status">
                                    <div className="availability-page-section-header">
                                        <div>
                                            <h3>Status atual</h3>
                                            <p>
                                                Altere o status atual deste usuário.
                                            </p>
                                        </div>
                                    </div>

                                    <UserAvailabilityMenu
                                        value={selectedUser.status ?? null}
                                        onChange={handleAvailabilityChange}
                                        disabled={updatingUserAvailabilityStatus}
                                    />

                                    <div className="availability-page-status-notice">
                                        <Clock3 size={15} />

                                        <span>
                                            A alteração será registrada na data de hoje,
                                            com o horário correspondente à mudança.
                                        </span>
                                    </div>
                                </section>

                                <section className="availability-page-month-summary">
                                    <div className="availability-page-month-header">
                                        <div>
                                            <h3>Resumo mensal</h3>
                                            <p>Horas registradas por status.</p>
                                        </div>

                                        <div className="availability-page-month-navigation">
                                            <button
                                                type="button"
                                                onClick={() => handleMonthChange(-1)}
                                                aria-label="Mês anterior"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            <strong>{monthLabel}</strong>

                                            <button
                                                type="button"
                                                onClick={() => handleMonthChange(1)}
                                                aria-label="Próximo mês"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {monthLoading ? (
                                        <LoadingState message="Carregando resumo mensal" />
                                    ) : monthError ? (
                                        <FeedbackState
                                            icon={<AlertCircle size={22} strokeWidth={2} />}
                                            title="Não foi possível carregar os dados do mês"
                                            message={getErrorMessage(monthError)}
                                            action={
                                                <Button
                                                    variant="secondary"
                                                    type="button"
                                                    onClick={() => refetchMonth()}
                                                >
                                                    <RefreshCcw size={16} />
                                                    Tentar novamente
                                                </Button>
                                            }
                                        />
                                    ) : monthData ? (
                                        <>
                                            {monthData.requires_review && (
                                                <div className="availability-page-review-notice">
                                                    <AlertTriangle size={16} />

                                                    <span>
                                                        Existem períodos antigos sem encerramento.
                                                        Os totais podem estar incompletos e precisam de revisão.
                                                    </span>
                                                </div>
                                            )}

                                            <div className="availability-page-month-totals">
                                                <div className="availability-page-total-card available">
                                                    <span>Disponível no mês</span>

                                                    <strong>
                                                        {formatDuration(monthData.totals.available_seconds)}
                                                    </strong>
                                                </div>

                                                <div className="availability-page-total-card external">
                                                    <span>Atividades externas no mês</span>

                                                    <strong>
                                                        {formatDuration(monthData.totals.external_activity_seconds)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </section>
                            </div>

                            {!monthLoading && !monthError && monthData && (
                                <section className="availability-page-month-days">
                                    <div className="availability-page-section-header">
                                        <div>
                                            <h3>Detalhamento diário</h3>
                                            <p>
                                                Selecione um dia para consultar ou editar seus registros.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="availability-page-days">
                                        <div className="availability-page-days-header">
                                            <span>Dia</span>
                                            <span>Disponível</span>
                                            <span>Externas</span>
                                            <span>Registros</span>
                                        </div>

                                        {monthData.days.map((day) => {
                                            const date = formatDay(day.work_date)
                                            const isSelected = day.work_date === selectedWorkDate

                                            const detailsId = `availability-day-details-${selectedUser.id}-${day.work_date}`

                                            return (
                                                <div
                                                    key={day.work_date}
                                                    className="availability-page-day-entry"
                                                >
                                                    <button
                                                        type="button"
                                                        className={`availability-page-day-row ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => handleToggleDay(day.work_date)}
                                                        aria-pressed={isSelected}
                                                        aria-expanded={isSelected}
                                                        aria-controls={detailsId}
                                                    >
                                                        <span className="availability-page-day-date">
                                                            <strong>{date.date}</strong>
                                                            <small>{date.weekday}</small>
                                                        </span>

                                                        <span className="availability-page-day-total available">
                                                            {formatDuration(day.totals.available_seconds)}
                                                        </span>

                                                        <span className="availability-page-day-total external">
                                                            {formatDuration(day.totals.external_activity_seconds)}
                                                        </span>

                                                        <span
                                                            className={`availability-page-day-records ${day.requires_review ? 'requires-review' : ''}`}
                                                        >
                                                            {day.periods.length > 0
                                                                ? `${day.periods.length} período${day.periods.length === 1 ? '' : 's'}`
                                                                : 'Sem registros'}

                                                            {day.notes && <FileText size={13} />}

                                                            {day.requires_review && <AlertTriangle size={13} />}

                                                            <ChevronDown
                                                                size={16}
                                                                className="availability-page-day-expand-icon"
                                                            />
                                                        </span>
                                                    </button>

                                                    {isSelected && (
                                                        <div
                                                            id={detailsId}
                                                            className="availability-page-day-details"
                                                        >
                                                            <div className="availability-page-day-details-header">
                                                                <div>
                                                                    <h3>
                                                                        Detalhes do dia {date.date}
                                                                    </h3>
                                                                    <p>{date.weekday}</p>
                                                                </div>

                                                                <span className="availability-page-day-count">
                                                                    {day.periods.length} período(s)
                                                                </span>
                                                            </div>

                                                            <div className="availability-page-day-totals">
                                                                <span>
                                                                    Disponível:
                                                                    <strong>
                                                                        {formatDuration(day.totals.available_seconds)}
                                                                    </strong>
                                                                </span>

                                                                <span>
                                                                    Atividades externas:
                                                                    <strong>
                                                                        {formatDuration(day.totals.external_activity_seconds)}
                                                                    </strong>
                                                                </span>
                                                            </div>

                                                            {day.requires_review && (
                                                                <div className="availability-page-review-notice">
                                                                    <AlertTriangle size={15} />

                                                                    <span>
                                                                        Este dia possui um período aberto que precisa de revisão.
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {day.periods.length === 0 ? (
                                                                <div className="availability-page-no-records">
                                                                    Nenhum período registrado neste dia.
                                                                </div>
                                                            ) : (
                                                                <div className="availability-page-periods">
                                                                    {day.periods.map((period) => {
                                                                        const availability = getUserAvailabilityOption(period.status)
                                                                        const statusClass = period.status.toLowerCase()

                                                                        const requiresReview =
                                                                            period.ended_time === null &&
                                                                            period.duration_seconds === null

                                                                        return (
                                                                            <div
                                                                                key={period.id}
                                                                                className={`availability-page-period ${requiresReview ? 'requires-review' : ''}`}
                                                                            >
                                                                                <span className={`availability-page-period-dot availability-${statusClass}`} />

                                                                                <div className="availability-page-period-info">
                                                                                    <strong>{availability.label}</strong>

                                                                                    <span>
                                                                                        {renderPeriodTime(period)}
                                                                                    </span>
                                                                                </div>

                                                                                <span className={`availability-page-period-duration ${requiresReview ? 'requires-review' : ''}`}>
                                                                                    {period.status === 'END_OF_DAY'
                                                                                        ? 'Marcador'
                                                                                        : requiresReview
                                                                                            ? 'Sem encerramento'
                                                                                            : formatDuration(period.duration_seconds)}
                                                                                </span>

                                                                                {requiresReview && (
                                                                                    <AlertTriangle
                                                                                        size={16}
                                                                                        className="availability-page-period-warning"
                                                                                        title="Período pendente de revisão"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )}

                                                            <AvailabilityDayEditor
                                                                key={`${selectedUser.id}-${day.work_date}`}
                                                                userId={selectedUser.id}
                                                                day={day}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}
