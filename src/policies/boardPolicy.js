const BOARD_ROLE_PERMISSIONS = {
    VIEW: ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'],
    EDIT: ['OWNER', 'ADMIN', 'EDITOR'],
    ADMIN: ['OWNER', 'ADMIN']
}

/**
 * Resolve a role efetiva do usuário no board.
 * Prioridade: ADMIN do sistema > criador do board > membro do board.
 */
export const getEffectiveBoardRole = ({
    user,
    boardCreatorId,
    boardMemberRole
}) => {
    if (!user) return null

    if (user.role === 'ADMIN') return 'ADMIN'

    if (user.id === boardCreatorId) return 'OWNER'

    return boardMemberRole ?? null
}

/**
 * Verifica se uma role possui determinado nível de permissão.
 */
export const checkBoardPermission = (role, permissionLevel) => {
    return BOARD_ROLE_PERMISSIONS[permissionLevel]?.includes(role) ?? false
}

/**
 * Permissões administrativas do board.
 */
const hasBoardManagementAccess = (role) => {
    return checkBoardPermission(role, 'ADMIN')
}

export const checkCanMoveBoardStructure = (role) => {
    return hasBoardManagementAccess(role)
}

export const checkCanManageColumnRestrictions = (role) => {
    return hasBoardManagementAccess(role)
}

/**
 * Permissões para criação de atividades.
 */
export const checkCanCreateItemUpdate = (role) => {
    return checkBoardPermission(role, 'EDIT')
}

export const checkCanCreateComment = (role) => {
    return checkBoardPermission(role, 'VIEW')
}