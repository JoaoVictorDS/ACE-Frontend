import { useCallback, useMemo, useState } from 'react'
import { useTable } from '@tanstack/react-table'
import { AlertCircle, ArrowDownUp, Building2, ChevronDown, ChevronUp, LayoutGrid, Plus, RefreshCcw, Search, Trash2, UsersRound } from 'lucide-react'
import { useUser } from '../../../../hooks/useUser'
import { useWorkspaces } from '../../../../hooks/useWorkspace'
import { useBoards } from '../../../../hooks/useBoard'
import { useWorkspaceMembers } from '../../../../hooks/useWorkspaceMember'
import { useBoardMembers, useUpsertBoardMember, useRemoveBoardMember } from '../../../../hooks/useBoardMember'
import { useToast } from '../../../../hooks/useToast'
import { Button } from '../../../../components/Button/Button'
import { ProfileSection } from '../../../../components/ProfileSection/ProfileSection'
import { LoadingScreen } from '../../../../components/LoadingScreen/LoadingScreen'
import { FeedbackState } from '../../../../components/FeedbackState/FeedbackState'
import { UserAvatar } from '../../../../components/UserAvatar/UserAvatar'
import { AddMemberModal } from '../../../../components/AddMemberModal/AddMemberModal'
import { getErrorMessage } from '../../../../utils/error'
import { ADD_MEMBER_ROLE_OPTIONS, MEMBERSHIP_ROLE_OPTIONS, getMembershipRoleLabel } from '../../../../utils/role'
import { createDefaultTableFeatures, createGlobalTextFilter, filterByExactValue } from '../../../../utils/table'
import './BoardMemberTab.css'

const filterBoardMemberSearch = createGlobalTextFilter((member) => {
    return `${member.user?.name ?? ''} ${member.user?.email ?? ''}`
})

const features = createDefaultTableFeatures()

export const BoardMemberTab = () => {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('')
    const [selectedBoardId, setSelectedBoardId] = useState('')
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)

    const { data: workspaces = [], isLoading: workspacesLoading, error: workspacesError, refetch: refetchWorkspaces } = useWorkspaces()
    const { data: boards = [], isLoading: boardsLoading, error: boardsError, refetch: refetchBoards } = useBoards(selectedWorkspaceId || undefined)
    const { data: workspaceMembers = [], isLoading: workspaceMembersLoading, error: workspaceMembersError, refetch: refetchWorkspaceMembers } = useWorkspaceMembers(selectedWorkspaceId || undefined)
    const { data: boardMembers = [], isLoading: boardMembersLoading, error: boardMembersError, refetch: refetchBoardMembers } = useBoardMembers(selectedBoardId || undefined)
    const { data: user } = useUser()
    const { upsertBoardMember } = useUpsertBoardMember()
    const { removeBoardMember } = useRemoveBoardMember()
    const { error, success } = useToast()

    const selectedWorkspace = workspaces.find((workspace) => String(workspace.id) === String(selectedWorkspaceId))
    const selectedBoard = boards.find((board) => String(board.id) === String(selectedBoardId))
    const canManageMembers = (user?.role === 'ADMIN' || ['OWNER', 'ADMIN'].includes(selectedWorkspace?.user_role) || ['OWNER', 'ADMIN'].includes(selectedBoard?.user_role))

    const eligibleUsers = useMemo(() => {
        const boardMemberIds = new Set(boardMembers.map((member) => String(member.user_id)))

        return workspaceMembers.filter((member) => (member.user && !boardMemberIds.has(String(member.user_id)))).map((member) => member.user)
    }, [workspaceMembers, boardMembers])

    const handleAddBoardMember = useCallback(async ({ user, role }) => {
        await upsertBoardMember({
            boardId: selectedBoardId,
            memberEmail: user.email,
            role
        })

        success({
            title: 'Membro adicionado ao board',
            message: `${user.name || user.email} agora faz parte do board.`
        })
    }, [selectedBoardId, upsertBoardMember, success])

    const handleEditBoardMemberRole = useCallback(async (member, role) => {
        try {
            await upsertBoardMember({
                boardId: selectedBoardId,
                memberEmail: member.user.email,
                role
            })

            success({
                title: 'Permissão do membro do board alterada',
                message: 'A permissão do membro do board foi alterada com sucesso.'
            })
        } catch (err) {
            error({
                title: 'Não foi possível alterar a permissão do membro do board',
                message: getErrorMessage(err)
            })
        }
    }, [selectedBoardId, upsertBoardMember, success, error])

    const handleRemoveBoardMember = useCallback(async (member) => {
        try {
            await removeBoardMember({
                boardId: selectedBoardId,
                memberId: member.user_id
            })

            success({
                title: 'Membro removido do board',
                message: 'O membro foi removido do board com sucesso.'
            })
        } catch (err) {
            error({
                title: 'Não foi possível remover o membro do board',
                message: getErrorMessage(err)
            })
        }
    }, [selectedBoardId, removeBoardMember, success, error])

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
                    <div className="board-member-tab-identity">
                        <UserAvatar user={member.user} />

                        <span className="board-member-tab-name">
                            {info.getValue() || 'Usuário sem nome'}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorFn: (member) => member.user?.email ?? '',
            id: 'email',
            header: 'E-mail',
            sortFn: 'text',
            enableGlobalFilter: false,
            cell: (info) => info.getValue() || '—'
        },
        {
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
                            className={`board-member-tab-role-badge board-member-tab-role-${String(role || 'unknown').toLowerCase()}`}
                        >
                            {getMembershipRoleLabel(role)}
                        </span>
                    )
                }

                return (
                    <select
                        className={`board-member-tab-role-select board-member-tab-role-${String(role || 'unknown').toLowerCase()}`}
                        value={role || ''}
                        onChange={(event) => handleEditBoardMemberRole(
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
        },
        ...(canManageMembers ? [
            {
                id: 'actions',
                header: 'Ações',
                enableSorting: false,
                enableGlobalFilter: false,
                cell: (info) => {
                    const member = info.row.original

                    return (
                        <div className="board-member-tab-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleRemoveBoardMember(member)}
                            >
                                <Trash2 size={14} strokeWidth={1.9} />
                                Remover
                            </Button>
                        </div>
                    )
                }
            }
        ] : [])
    ], [
        canManageMembers,
        handleEditBoardMemberRole,
        handleRemoveBoardMember
    ])

    const table = useTable({
        data: boardMembers,
        columns,
        features,
        globalFilterFn: filterBoardMemberSearch
    })

    const filteredMembersCount = table.getRowModel().rows.length
    const roleFilter = table.getColumn('role').getFilterValue() ?? 'all'

    const availableRoles = useMemo(() => {
        return [...new Set(
            boardMembers
                .map((member) => member.role)
                .filter(Boolean)
        )].sort((a, b) => (
            getMembershipRoleLabel(a).localeCompare(
                getMembershipRoleLabel(b),
                'pt-BR'
            )
        ))
    }, [boardMembers])

    const handleWorkspaceChange = (event) => {
        const workspaceId = event.target.value ? Number(event.target.value) : ''

        setSelectedWorkspaceId(workspaceId)
        setSelectedBoardId('')
        setIsAddMemberModalOpen(false)

        table.setGlobalFilter('')
        table.getColumn('role').setFilterValue(undefined)
    }

    const handleBoardChange = (event) => {
        const boardId = event.target.value ? Number(event.target.value) : ''

        setSelectedBoardId(boardId)
        setIsAddMemberModalOpen(false)

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
        <>
            <div className="member-tab-stack board-member-tab-stack">
                <div className="board-member-tab-header">
                    <div>
                        <h3>Membros de boards</h3>

                        <p>
                            Gerencie os usuários que têm acesso a cada board.
                        </p>
                    </div>
                </div>

                <ProfileSection
                    title="Selecionar board"
                    description="Escolha o workspace e o board que deseja gerenciar."
                >
                    <div className="board-member-tab-selectors">
                        <div className="board-member-tab-field">
                            <label htmlFor="board-member-workspace">
                                Workspace
                            </label>

                            <select
                                id="board-member-workspace"
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

                        <div className="board-member-tab-field">
                            <label htmlFor="board-member-board">
                                Board
                            </label>

                            <select
                                id="board-member-board"
                                value={selectedBoardId}
                                onChange={handleBoardChange}
                                disabled={
                                    !selectedWorkspaceId ||
                                    boardsLoading ||
                                    boardsError ||
                                    boards.length === 0
                                }
                            >
                                <option value="" disabled>
                                    {!selectedWorkspaceId
                                        ? 'Selecione um workspace primeiro'
                                        : boardsLoading
                                            ? 'Carregando boards...'
                                            : boards.length === 0
                                                ? 'Nenhum board disponível'
                                                : 'Selecione um board'}
                                </option>

                                {boards.map((board) => (
                                    <option
                                        key={board.id}
                                        value={board.id}
                                    >
                                        {board.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedWorkspaceId && boardsError && (
                        <div className="board-member-tab-selector-feedback">
                            <FeedbackState
                                icon={<AlertCircle size={22} strokeWidth={2} />}
                                title="Não foi possível carregar os boards"
                                message={getErrorMessage(boardsError)}
                                action={
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => refetchBoards()}
                                    >
                                        <RefreshCcw size={16} />
                                        Tentar novamente
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </ProfileSection>

                <ProfileSection
                    title="Membros do board"
                    description="Consulte e gerencie os usuários vinculados ao board selecionado."
                >
                    {!selectedWorkspaceId && (
                        <div className="board-member-tab-placeholder">
                            <Building2 size={26} strokeWidth={1.8} />

                            <h3>Selecione um workspace e um board</h3>

                            <p>
                                Selecione primeiro um workspace e depois o board
                                cujos membros deseja gerenciar.
                            </p>
                        </div>
                    )}

                    {selectedWorkspaceId && !selectedBoardId && !boardsLoading && !boardsError && (
                        <div className="board-member-tab-placeholder">
                            <LayoutGrid size={26} strokeWidth={1.8} />

                            <h3>
                                {boards.length === 0
                                    ? 'Nenhum board disponível'
                                    : 'Selecione um board'}
                            </h3>

                            <p>
                                {boards.length === 0
                                    ? 'Os boards deste workspace aparecerão aqui quando estiverem disponíveis.'
                                    : 'Os membros e suas permissões serão exibidos após a seleção de um board.'}
                            </p>
                        </div>
                    )}

                    {selectedWorkspaceId && boardsLoading && (
                        <div
                            className="board-member-tab-state"
                            role="status"
                        >
                            <span className="board-member-tab-loading" />
                            Carregando boards do workspace...
                        </div>
                    )}

                    {selectedBoardId && boardMembersLoading && (
                        <div
                            className="board-member-tab-state"
                            role="status"
                        >
                            <span className="board-member-tab-loading" />
                            Carregando membros do board...
                        </div>
                    )}

                    {selectedBoardId && boardMembersError && (
                        <FeedbackState
                            icon={<AlertCircle size={22} strokeWidth={2} />}
                            title="Não foi possível carregar os membros"
                            message={getErrorMessage(boardMembersError)}
                            action={
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => refetchBoardMembers()}
                                >
                                    <RefreshCcw size={16} />
                                    Tentar novamente
                                </Button>
                            }
                        />
                    )}

                    {selectedBoardId && !boardMembersLoading && !boardMembersError && (
                        <>
                            <div className="board-member-tab-toolbar">
                                <div className="board-member-tab-search">
                                    <Search size={17} strokeWidth={2} />

                                    <input
                                        type="search"
                                        value={table.state.globalFilter ?? ''}
                                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                                        placeholder="Buscar por nome ou e-mail..."
                                        aria-label="Buscar membros do board"
                                    />
                                </div>

                                <select
                                    className="board-member-tab-role-filter"
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

                                <span className="board-member-tab-count">
                                    {filteredMembersCount} de {boardMembers.length}{' '}
                                    {boardMembers.length === 1 ? 'membro' : 'membros'}
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

                            <div className="board-member-tab-table-wrapper">
                                <table className="board-member-tab-table">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : header.column.getCanSort()
                                                                ? (
                                                                    <div className="board-member-tab-sort">
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
                                                                    <span className="board-member-tab-column-heading">
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
                                                    className="board-member-tab-empty-cell"
                                                >
                                                    <div className="board-member-tab-empty-state">
                                                        <UsersRound size={26} strokeWidth={1.8} />

                                                        <h3>
                                                            {boardMembers.length === 0
                                                                ? 'Nenhum membro neste board'
                                                                : 'Nenhum membro encontrado'}
                                                        </h3>

                                                        <p>
                                                            {boardMembers.length === 0
                                                                ? 'Os membros vinculados a este board aparecerão aqui.'
                                                                : 'Tente alterar a busca ou selecionar outra permissão.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </ProfileSection>
            </div>

            {isAddMemberModalOpen && selectedBoardId && canManageMembers && (
                <AddMemberModal
                    title="Adicionar membro ao board"
                    description={`Selecione um membro do workspace para adicionar ao board ${selectedBoard?.name || ''}.`}
                    users={eligibleUsers}
                    roleOptions={ADD_MEMBER_ROLE_OPTIONS}
                    defaultRole="VIEWER"
                    isLoadingUsers={workspaceMembersLoading || boardMembersLoading}
                    usersError={workspaceMembersError || boardMembersError}
                    onRetryUsers={() => {
                        refetchWorkspaceMembers()
                        refetchBoardMembers()
                    }}
                    onClose={() => setIsAddMemberModalOpen(false)}
                    onSubmit={handleAddBoardMember}
                />
            )}
        </>
    )
}