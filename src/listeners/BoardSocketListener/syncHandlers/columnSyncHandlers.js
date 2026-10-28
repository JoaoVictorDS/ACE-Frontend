import { getColumnsByBoard } from '../../../services/columnService'

const pendingSyncs = new Map()

export const syncVisibleColumns = ({ queryClient, boardId }) => {
    const syncKey = String(boardId)
    const previousSync = pendingSyncs.get(syncKey) ?? Promise.resolve()

    const currentSync = previousSync
        .catch(() => { })
        .then(async () => {
            const columns = await getColumnsByBoard(boardId)
            const queryKey = ['board', boardId]

            await queryClient.cancelQueries({
                queryKey,
                exact: true
            })

            queryClient.setQueryData(queryKey, currentBoard => {
                if (!currentBoard) {
                    return currentBoard
                }

                return {
                    ...currentBoard,
                    columns
                }
            })
        })

    pendingSyncs.set(syncKey, currentSync)

    const cleanup = () => {
        if (pendingSyncs.get(syncKey) === currentSync) {
            pendingSyncs.delete(syncKey)
        }
    }

    currentSync.then(cleanup, cleanup)

    return currentSync
}