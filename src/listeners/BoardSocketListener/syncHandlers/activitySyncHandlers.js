export const syncItemUpdates = ({ queryClient, event }) => {
    return queryClient.invalidateQueries({
        queryKey: ['item-updates', event.resource.item.id],
        exact: true
    })
}

export const syncComments = ({ queryClient, event }) => {
    return queryClient.invalidateQueries({
        queryKey: ['comments', event.resource.item.id],
        exact: true
    })
}