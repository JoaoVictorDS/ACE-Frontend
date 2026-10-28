import { syncVisibleColumns } from './syncHandlers/columnSyncHandlers'

export const BOARD_CHANGE_SYNC_REGISTRY = {
    COLUMN: {
        MOVE: syncVisibleColumns,
        DELETE: syncVisibleColumns
    }
}