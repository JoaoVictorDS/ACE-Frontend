const isSameId = (firstId, secondId) => {
    return (
        firstId != null &&
        secondId != null &&
        String(firstId) === String(secondId)
    )
}

export const getItemActivityPermissions = ({ activityType, entry, user, boardCreatorId, canCreateItemUpdate, canCreateComment }) => {
    const isAuthor = isSameId(user?.id, entry?.user_id)
    const isBoardCreator = isSameId(user?.id, boardCreatorId)
    const isSystemAdmin = user?.role === 'ADMIN'

    const canReply = activityType === 'updates'
        ? canCreateItemUpdate
        : activityType === 'comments'
            ? canCreateComment
            : false

    return {
        canReply: Boolean(canReply),
        canEdit: isAuthor,
        canDelete: isAuthor || isBoardCreator || isSystemAdmin
    }
}