import { BOARD_CHANGE_REGISTRY } from './boardChangeRegistry'
import { BOARD_CHANGE_SYNC_REGISTRY } from './boardChangeSyncRegistry'

export const dispatchBoardChange = async ({ queryClient, boardId, event }) => {
    if (!event) {
        return
    }

    const queryKey = ['board', boardId]

    const syncHandler =
        BOARD_CHANGE_SYNC_REGISTRY[event.entityType]?.[event.action]

    if (syncHandler) {
        try {
            await syncHandler({
                queryClient,
                boardId,
                event
            })
        } catch {
            await queryClient.invalidateQueries({
                queryKey,
                exact: true
            })
        }

        return
    }

    const entityHandlers = BOARD_CHANGE_REGISTRY[event.entityType]

    if (!entityHandlers) {
        return
    }

    const handler = entityHandlers[event.action]

    if (!handler) {
        return
    }

    queryClient.setQueryData(queryKey, currentData => {
        if (!currentData) {
            return currentData
        }

        return handler(currentData, event)
    })
}