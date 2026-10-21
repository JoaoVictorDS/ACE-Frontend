import { useCallback, useMemo, useState } from 'react'
import { useTable } from '@tanstack/react-table'
import { AlertCircle, ArrowDownUp, Building2, ChevronDown, ChevronUp, Plus, RefreshCcw, Search, Trash2, UsersRound } from 'lucide-react'
import { createDefaultTableFeatures, createGlobalTextFilter, filterByExactValue } from '../../../../utils/table'
import { ADD_MEMBER_ROLE_OPTIONS, getMembershipRoleLabel, MEMBERSHIP_ROLE_OPTIONS } from '../../../../utils/role'
import { useUser, useUsers } from '../../../../hooks/useUser'
import { useWorkspaces } from '../../../../hooks/useWorkspace'
import { useWorkspaceMembers, useUpsertWorkspaceMember, useRemoveWorkspaceMember } from '../../../../hooks/useWorkspaceMember'
import { useToast } from '../../../../hooks/useToast'
import { AddMemberModal } from '../../../../components/AddMemberModal/AddMemberModal'
import { Button } from '../../../../components/Button/Button'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import { LoadingScreen } from '../../../../components/LoadingScreen/LoadingScreen'
import { FeedbackState } from '../../../../components/FeedbackState/FeedbackState'
import { UserAvatar } from '../../../../components/UserAvatar/UserAvatar'
import { getErrorMessage } from '../../../../utils/error'
import './WorkspaceMemberTab.css'

const filterMemberSearch = createGlobalTextFilter((member) => {
    return `${member.user?.name ?? ''} ${member.user?.email ?? ''}`
})

const features = createDefaultTableFeatures()

export const WorkspaceMemberTab = () => {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('')
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
    const { data: workspaces = [], isLoading: workspacesLoading, error: workspacesError, refetch: refetchWorkspaces } = useWorkspaces()
    const { data: workspaceMembers = [], isLoading: workspaceMembersLoading, error: workspaceMembersError, refetch: refetchWorkspaceMembers } = useWorkspaceMembers(selectedWorkspaceId || undefined)
    const { data: user } = useUser()
    const { data: users = [], isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()
    const { upsertWorkspaceMember } = useUpsertWorkspaceMember()
    const { removeWorkspaceMember } = useRemoveWorkspaceMember()
    const { error, success } = useToast()

    const selectedWorkspace = workspaces.find((workspace) => String(workspace.id) === String(selectedWorkspaceId))
    const canManageMembers = (user?.role === 'ADMIN' || ['OWNER', 'ADMIN'].includes(selectedWorkspace?.user_role))

    const eligibleUsers = useMemo(() => {
        const existingMemberIds = new Set(workspaceMembers.map((member) => String(member.user_id)))

        return users.filter((user) => (user.is_active === true && !existingMemberIds.has(String(user.id))))
    }, [users, workspaceMembers])

    const handleAddMember = useCallback(async ({ user, role }) => {
        await upsertWorkspaceMember({
            workspaceId: selectedWorkspaceId,
            memberEmail: user.email,
            role
        })

        success({
            title: 'Membro adicionado ao workspace',
            message: `${user.name || user.email} agora faz parte do workspace.`
        })
    }, [selectedWorkspaceId, upsertWorkspaceMember, success])

    const handleEditMemberRole = useCallback(async (member, role) => {
        try {
            await upsertWorkspaceMember({
                workspaceId: selectedWorkspaceId,
                memberEmail: member.user.email,
                role
            })

            success({
                title: 'Permissão do membro do workspace alterada',
                message: 'A permissão do membro do workspace foi alterada com sucesso.'
            })
        } catch (err) {
            error({
                title: 'Não foi possível alterar a permissão do membro do workspace',
                message: getErrorMessage(err)
            })
        }

    }, [selectedWorkspaceId, upsertWorkspaceMember, success, error])

    const handleRemoveMember = useCallback(async (member) => {
        try {
            await removeWorkspaceMember({
                workspaceId: selectedWorkspaceId,
                memberId: member.user_id
            })

            success({
                title: 'Membro removido do workspace',
                message: 'O membro foi removido do workspace com sucesso.'
            })
        } catch (err) {
            error({
                title: 'Não foi possível remover o membro do workspace',
                message: getErrorMessage(err)
            })
        }
    }, [selectedWorkspaceId, upsertWorkspaceMember, success, error])

    const columns = useMemo(() => [
        {
            accessorFn: (member) => member.user?.name ?? '',
            id: 'name',
            header: 'Membro',
            sortFn: 'text',
            enableGlobalFilter: true,
            cell: (info) => {
                const member = info.row.original

                return (
                    <div className="workspace-member-tab-identity">
                        <UserAvatar user={member.user} />

                        <span className="workspace-member-tab-name">
                            {info.getValue() || 'Usuário sem nome'}
                        </span>
                    </div>
                )
            }
        }, {
            accessorFn: (member) => member.user?.email ?? '',
            id: 'email',
            header: 'E-mail',
            sortFn: 'text',
            enableGlobalFilter: false,
            cell: (info) => info.getValue() || '—'
        }, {
            accessorKey: 'role',
            header: 'Permissão',
            sortFn: 'text',
            filterFn: filterByExactValue,
            enableGlobalFilter: false,
            cell: (info) => {
                const member = info.row.original
                const role = info.getValue()

                if (!canManageMembers) {
                    return (
                        <span
                            className={`workspace-member-tab-role-badge workspace-member-tab-role-${String(role || 'unknown').toLowerCase()}`}
                        >
                            {getMembershipRoleLabel(role)}
                        </span>
                    )
                }

                return (
                    <select
                        className={`workspace-member-tab-role-select workspace-member-tab-role-${String(role || 'unknown').toLowerCase()}`}
                        value={role || ''}
                        onChange={(event) => handleEditMemberRole(
                            member,
                            event.target.value
                        )}
                        aria-label={`Alterar permissão de ${member.user?.name || 'membro'}`}
                    >
                        {MEMBERSHIP_ROLE_OPTIONS.map((availableRole) => (
                            <option key={availableRole} value={availableRole}>
                                {getMembershipRoleLabel(availableRole)}
                            </option>
                        ))}
                    </select>
                )
            }
        }, ...(canManageMembers ? [
            {
                id: 'actions',
                header: 'Ações',
                enableSorting: false,
                enableGlobalFilter: false,
                cell: (info) => {
                    const member = info.row.original

                    return (
                        <div className="workspace-member-tab-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleRemoveMember(member)}
                            >
                                <Trash2 size={14} strokeWidth={1.9} />
                                Remover
                            </Button>
                        </div>
                    )
                }
            }
        ] : [])
    ], [canManageMembers, handleEditMemberRole, handleRemoveMember])

    const table = useTable({
        data: workspaceMembers,
        columns,
        features,
        globalFilterFn: filterMemberSearch
    })

    const filteredMembersCount = table.getRowModel().rows.length
    const roleFilter = table.getColumn('role').getFilterValue() ?? 'all'

    const availableRoles = useMemo(() => {
        return [...new Set(
            workspaceMembers
                .map((member) => member.role)
                .filter(Boolean)
        )].sort((a, b) => getMembershipRoleLabel(a).localeCompare(getMembershipRoleLabel(b), 'pt-BR'))
    }, [workspaceMembers])

    const handleWorkspaceChange = (event) => {
        const workspaceId = event.target.value
            ? Number(event.target.value)
            : ''

        setSelectedWorkspaceId(workspaceId)
        table.setGlobalFilter('')
        table.getColumn('role').setFilterValue(undefined)
    }

    if (workspacesLoading) {
        return <LoadingScreen />
    }

    if (workspacesError) {
        return (
            <FeedbackState
                icon={<AlertCircle size={22} strokeWidth={2} />}
                title="Não foi possível carregar os workspaces"
                message={getErrorMessage(workspacesError)}
                action={
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => refetchWorkspaces()}
                    >
                        <RefreshCcw size={16} />
                        Tentar novamente
                    </Button>
                }
            />
        )
    }

    return (
        <div className="member-tab-stack workspace-member-tab-stack">
            <div className="workspace-member-tab-header">
                <div>
                    <h3>Membros de workspaces</h3>

                    <p>
                        Gerencie os usuários que têm acesso a cada workspace.
                    </p>
                </div>
            </div>

            <ProfileSection
                title="Selecionar workspace"
                description="Escolha o workspace cujos membros deseja gerenciar."
            >
                <div className="workspace-member-tab-selector">
                    <label htmlFor="workspace-member-selector">
                        Workspace
                    </label>

                    <select
                        id="workspace-member-selector"
                        value={selectedWorkspaceId}
                        onChange={handleWorkspaceChange}
                        disabled={workspaces.length === 0}
                    >
                        <option value="" disabled>
                            {workspaces.length === 0
                                ? 'Nenhum workspace disponível'
                                : 'Selecione um workspace'}
                        </option>

                        {workspaces.map((workspace) => (
                            <option
                                key={workspace.id}
                                value={workspace.id}
                            >
                                {workspace.name}
                            </option>
                        ))}
                    </select>
                </div>
            </ProfileSection>

            <ProfileSection
                title="Membros do workspace"
                description="Consulte e gerencie os vínculos dos usuários com o workspace selecionado."
            >
                {!selectedWorkspaceId && (
                    <div className="workspace-member-tab-placeholder">
                        <Building2 size={26} strokeWidth={1.8} />

                        <h3>
                            {workspaces.length === 0 ? 'Nenhum workspace disponível' : 'Selecione um workspace'}
                        </h3>

                        <p>
                            {workspaces.length === 0 ? 'Os workspaces disponíveis para gerenciamento aparecerão aqui.' : 'Os membros e suas permissões serão exibidos aqui após a seleção de um workspace.'}
                        </p>
                    </div>
                )}

                {selectedWorkspaceId && workspaceMembersLoading && (
                    <div
                        className="workspace-member-tab-state"
                        role="status"
                    >
                        <span className="workspace-member-tab-loading" />
                        Carregando membros do workspace...
                    </div>
                )}

                {selectedWorkspaceId && workspaceMembersError && (
                    <FeedbackState
                        icon={<AlertCircle size={22} strokeWidth={2} />}
                        title="Não foi possível carregar os membros"
                        message={getErrorMessage(workspaceMembersError)}
                        action={
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => refetchWorkspaceMembers()}
                            >
                                <RefreshCcw size={16} />
                                Tentar novamente
                            </Button>
                        }
                    />
                )}

                {selectedWorkspaceId && !workspaceMembersLoading && !workspaceMembersError && (
                    <>
                        <div className="workspace-member-tab-toolbar">
                            <div className="workspace-member-tab-search">
                                <Search size={17} strokeWidth={2} />

                                <input
                                    type="search"
                                    value={table.state.globalFilter ?? ''}
                                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                                    placeholder="Buscar por nome ou e-mail..."
                                    aria-label="Buscar membros"
                                />
                            </div>

                            <select
                                className="workspace-member-tab-role-filter"
                                value={roleFilter}
                                onChange={(event) => table.getColumn('role').setFilterValue(
                                    event.target.value === 'all'
                                        ? undefined
                                        : event.target.value
                                )}
                                aria-label="Filtrar membros por permissão"
                            >
                                <option value="all">Todas as permissões</option>

                                {availableRoles.map((role) => (
                                    <option key={role} value={role}>
                                        {getMembershipRoleLabel(role)}
                                    </option>
                                ))}
                            </select>

                            <span className="workspace-member-tab-count">
                                {filteredMembersCount} de {workspaceMembers.length}{' '}
                                {workspaceMembers.length === 1 ? 'membro' : 'membros'}
                            </span>

                            {canManageMembers && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => setIsAddMemberModalOpen(true)}
                                >
                                    <Plus size={17} strokeWidth={2} />
                                    Adicionar membro
                                </Button>
                            )}
                        </div>

                        <div className="workspace-member-tab-table-wrapper">
                            <table className="workspace-member-tab-table">
                                <thead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : header.column.getCanSort()
                                                            ? (
                                                                <div className="workspace-member-tab-sort">
                                                                    <Button
                                                                        type="button"
                                                                        variant="secondary"
                                                                        onClick={header.column.getToggleSortingHandler()}
                                                                    >
                                                                        <table.FlexRender header={header} />

                                                                        {header.column.getIsSorted() === 'asc' ? (
                                                                            <ChevronUp size={15} />
                                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                                            <ChevronDown size={15} />
                                                                        ) : (
                                                                            <ArrowDownUp size={13} />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            )
                                                            : (
                                                                <span className="workspace-member-tab-column-heading">
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
                                            <td
                                                colSpan={columns.length}
                                                className="workspace-member-tab-empty-cell"
                                            >
                                                <div className="workspace-member-tab-empty-state">
                                                    <UsersRound size={26} strokeWidth={1.8} />

                                                    <h3>
                                                        {workspaceMembers.length === 0
                                                            ? 'Nenhum membro neste workspace'
                                                            : 'Nenhum membro encontrado'}
                                                    </h3>

                                                    <p>
                                                        {workspaceMembers.length === 0
                                                            ? 'Os usuários vinculados a este workspace aparecerão aqui.'
                                                            : 'Tente alterar a busca ou selecionar outra permissão.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {isAddMemberModalOpen && selectedWorkspaceId && (
                            <AddMemberModal
                                title="Adicionar membro ao workspace"
                                description={`Selecione um usuário para adicionar ao workspace ${selectedWorkspace?.name || ''}.`}
                                users={eligibleUsers}
                                roleOptions={ADD_MEMBER_ROLE_OPTIONS}
                                defaultRole="VIEWER"
                                isLoadingUsers={usersLoading}
                                usersError={usersError}
                                onRetryUsers={refetchUsers}
                                onClose={() => setIsAddMemberModalOpen(false)}
                                onSubmit={handleAddMember}
                            />
                        )}
                    </>
                )}
            </ProfileSection>
        </div>
    )
}