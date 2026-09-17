export const getNotificationTarget = (notification) => {
    const resource = notification.payload?.resource

    const workspaceId = resource?.workspaceId
    const boardId = resource?.boardId

    const itemId = resource?.item?.id ?? notification.item_id

    if (workspaceId && boardId) {
        const searchParams = new URLSearchParams()

        if (itemId) {
            searchParams.set('itemId', itemId)
        }

        const search = searchParams.toString()

        return `/workspaces/${workspaceId}/boards/${boardId}${search ? `?${search}` : ''}`
    }

    if (workspaceId) {
        return `/workspaces/${workspaceId}`
    }

    return '/dashboard'
}