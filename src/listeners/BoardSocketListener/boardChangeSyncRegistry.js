import { syncVisibleColumns } from './syncHandlers/columnSyncHandlers'
import { syncItemUpdates, syncComments } from './syncHandlers/activitySyncHandlers'

export const BOARD_CHANGE_SYNC_REGISTRY = {
    COLUMN: {
        MOVE: syncVisibleColumns,
        DELETE: syncVisibleColumns
    },

    COLUMN_RESTRICTION: {
        UPDATE: syncVisibleColumns
    },

    ITEM_UPDATE: {
        CREATE: syncItemUpdates,
        UPDATE: syncItemUpdates,
        DELETE: syncItemUpdates
    },

    COMMENT: {
        CREATE: syncComments,
        UPDATE: syncComments,
        DELETE: syncComments
    },
}