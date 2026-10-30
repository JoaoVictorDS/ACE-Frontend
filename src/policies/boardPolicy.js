export const checkCanMoveBoardStructure = (systemRole, boardRole) => {
    return (
        systemRole === 'ADMIN' ||
        boardRole === 'ADMIN' ||
        boardRole === 'OWNER'
    )
}