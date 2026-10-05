import { BOARD_CHANGE_REGISTRY } from './boardChangeRegistry'

export const dispatchBoardChange = ({ queryClient, boardId, event }) => {
    if (!event) {
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

    queryClient.setQueryData(['board', boardId], (currentData) => handler(currentData, event))
}