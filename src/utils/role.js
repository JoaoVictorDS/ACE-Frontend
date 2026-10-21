export const SYSTEM_ROLE_LABELS = {
    ADMIN: 'Administrador',
    MEMBER: 'Membro'
}

export const MEMBERSHIP_ROLE_LABELS = {
    OWNER: 'Proprietário',
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
    VIEWER: 'Visualizador'
}

export const MEMBERSHIP_ROLE_OPTIONS = Object.keys(MEMBERSHIP_ROLE_LABELS)

export const ADD_MEMBER_ROLE_OPTIONS = [
    'ADMIN',
    'EDITOR',
    'VIEWER'
]

export const getSystemRoleLabel = (role) => {
    return SYSTEM_ROLE_LABELS[role] || role || 'Não definido'
}

export const getMembershipRoleLabel = (role) => {
    return MEMBERSHIP_ROLE_LABELS[role] || role || 'Não definido'
}