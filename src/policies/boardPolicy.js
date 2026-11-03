const hasBoardManagementAccess = (systemRole, boardRole) => {
    return (
        systemRole === 'ADMIN' ||
        boardRole === 'ADMIN' ||
        boardRole === 'OWNER'
    )
}

export const checkCanMoveBoardStructure = (systemRole, boardRole) => {
    return hasBoardManagementAccess(systemRole, boardRole)
}

export const checkCanManageColumnRestrictions = (systemRole, boardRole) => {
    return hasBoardManagementAccess(systemRole, boardRole)
}