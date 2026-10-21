import { useMemo, useState } from 'react'
import { useUsers, useUser } from '../../../../hooks/useUser'
import { useTable } from '@tanstack/react-table'
import { createDefaultTableFeatures, createGlobalTextFilter, filterByExactValue } from '../../../../utils/table'
import { getSystemRoleLabel } from '../../../../utils/role'
import { AlertCircle, ArrowDownUp, ChevronDown, ChevronUp, Pencil, RefreshCcw, Search, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import { Button } from '../../../../components/Button/Button'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import { LoadingScreen } from '../../../../components/LoadingScreen/LoadingScreen'
import { FeedbackState } from '../../../../components/FeedbackState/FeedbackState'
import { UserAvatar } from '../../../../components/UserAvatar/UserAvatar'
import { getErrorMessage } from '../../../../utils/error'
import { EditUserModal } from '../../../../components/EditUserModal/EditUserModal'
import { CreateUserModal } from '../../../../components/CreateUserModal/CreateUserModal'
import './UserTab.css'

const filterUserSearch = createGlobalTextFilter((user) => {
    return `${user.name ?? ''} ${user.email ?? ''}`
})

const features = createDefaultTableFeatures()

export const UserTab = () => {
    const { data: user } = useUser()
    const { data: users = [], isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const isAdmin = user?.role === 'ADMIN'
    const currentUserId = user?.id

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Usuário',
            sortFn: 'text',
            enableGlobalFilter: true,
            cell: (info) => (
                <div className="user-tab-identity">
                    <UserAvatar user={info.row.original} />

                    <span className="user-tab-name">
                        {info.getValue() || 'Usuário sem nome'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'role',
            header: 'Perfil de acesso',
            sortFn: 'text',
            filterFn: filterByExactValue,
            enableGlobalFilter: false,
            cell: (info) => (
                <span
                    className={`user-tab-role-badge ${info.getValue() === 'ADMIN' ? 'user-tab-role-admin' : ''}`}
                >
                    {getSystemRoleLabel(info.getValue())}
                </span>
            )
        },
        {
            accessorKey: 'email',
            header: 'E-mail',
            sortFn: 'text',
            enableGlobalFilter: false,
            cell: (info) => info.getValue() || '—'
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            enableGlobalFilter: false,
            cell: (info) => {
                const isActive = info.getValue() === true

                return (
                    <span
                        className={`user-tab-status-badge ${isActive ? 'user-tab-status-active' : 'user-tab-status-inactive'}`}
                    >
                        <span className="user-tab-status-dot" />
                        {isActive ? 'Ativado' : 'Desativado'}
                    </span>
                )
            }
        },
        ...(isAdmin ? [
            {
                id: 'actions',
                header: 'Ações',
                enableSorting: false,
                enableGlobalFilter: false,
                cell: (info) => {
                    const targetUser = info.row.original

                    if (targetUser.id === currentUserId) {
                        return null
                    }

                    return (
                        <button
                            type="button"
                            className="user-tab-edit-button"
                            onClick={() => setSelectedUser(targetUser)}
                            aria-label={`Editar ${targetUser.name ?? 'usuário'}`}
                        >
                            <Pencil size={15} strokeWidth={1.9} />
                            Editar
                        </button>
                    )
                }
            }
        ] : [])
    ], [isAdmin, currentUserId])

    const table = useTable({
        data: users,
        columns,
        features,
        globalFilterFn: filterUserSearch
    })

    const filteredUsersCount = table.getRowModel().rows.length
    const roleFilter = table.getColumn('role').getFilterValue() ?? 'all'

    if (usersLoading) {
        return <LoadingScreen />
    }

    if (usersError) {
        return (
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
        )
    }

    return (
        <>
            <div className="member-tab-stack">
                <div className="user-tab-header">
                    <div>
                        <h3>Usuários do sistema</h3>

                        <p>
                            Gerencie as contas e os perfis de acesso dos usuários
                            cadastrados.
                        </p>
                    </div>

                    {isAdmin && (
                        <div className="user-tab-header-actions">
                            <span className="user-tab-admin-label">
                                <ShieldCheck size={15} strokeWidth={2} />
                                Acesso administrativo
                            </span>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => setIsCreateUserModalOpen(true)}
                            >
                                <UserPlus size={17} strokeWidth={2} />
                                Novo usuário
                            </Button>
                        </div>
                    )}
                </div>

                <ProfileSection
                    title="Contas cadastradas"
                    description="Consulte os usuários e gerencie seus perfis de acesso."
                >
                    <div className="user-tab-toolbar">
                        <div className="user-tab-search">
                            <Search size={17} strokeWidth={2} />

                            <input
                                type="search"
                                value={table.state.globalFilter ?? ''}
                                onChange={(event) => table.setGlobalFilter(event.target.value)}
                                placeholder="Buscar por nome ou e-mail..."
                                aria-label="Buscar usuários"
                            />
                        </div>

                        <select
                            className="user-tab-role-filter"
                            value={roleFilter}
                            onChange={(event) => table.getColumn('role').setFilterValue(
                                event.target.value === 'all' ? undefined : event.target.value
                            )}
                            aria-label="Filtrar usuários por perfil"
                        >
                            <option value="all">Todos os perfis</option>
                            <option value="ADMIN">Administradores</option>
                            <option value="MEMBER">Membros</option>
                        </select>

                        <span className="user-tab-count">
                            {filteredUsersCount} {filteredUsersCount === 1 ? 'usuário' : 'usuários'}
                        </span>
                    </div>

                    <div className="user-tab-table-wrapper">
                        <table className="user-tab-table">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id}>
                                                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                    <button
                                                        type="button"
                                                        className="user-tab-sort"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        aria-label={`Ordenar por ${header.column.id}`}
                                                    >
                                                        <table.FlexRender header={header} />

                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <ChevronUp size={15} />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <ChevronDown size={15} />
                                                        ) : (
                                                            <ArrowDownUp size={13} />
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="user-tab-column-heading">
                                                        <table.FlexRender header={header} />
                                                    </span>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody>
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id}>
                                            {row.getAllCells().map((cell) => (
                                                <td key={cell.id}>
                                                    <table.FlexRender cell={cell} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="user-tab-empty-cell">
                                            <div className="user-tab-empty-state">
                                                <UsersRound size={26} strokeWidth={1.8} />

                                                <h3>
                                                    {users.length === 0
                                                        ? 'Nenhum usuário cadastrado'
                                                        : 'Nenhum usuário encontrado'}
                                                </h3>

                                                <p>
                                                    {users.length === 0
                                                        ? 'Os usuários cadastrados aparecerão aqui.'
                                                        : 'Tente alterar a busca ou selecionar outro perfil.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </ProfileSection>
            </div>

            {isAdmin && isCreateUserModalOpen && (
                <CreateUserModal
                    onClose={() => setIsCreateUserModalOpen(false)}
                />
            )}

            {selectedUser && (
                <EditUserModal
                    key={selectedUser.id}
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </>
    )
}