import { createItemValue, updateItemValue, deleteItemValue } from './handlers/itemValueHandlers'
import { updateItem } from './handlers/itemHandlers'

export const BOARD_CHANGE_REGISTRY = {
    ITEM_VALUE: {
        CREATE: createItemValue,
        UPDATE: updateItemValue,
        DELETE: deleteItemValue,
    },

    ITEM: {
        // CREATE: createItem,
        UPDATE: updateItem,
        // DELETE: deleteItem,
        // MOVE: moveItem,
    },

    SECTION: {
        // CREATE: createSection,
        // UPDATE: updateSection,
        // DELETE: deleteSection,
        // MOVE: moveSection,
    },

    COLUMN: {
        // CREATE: createColumn,
        // UPDATE: updateColumn,
        // DELETE: deleteColumn,
        // MOVE: moveColumn,
    },

    MEMBER: {
        // CREATE: addMember,
        // UPDATE: updateMember,
        // DELETE: removeMember,
    }
}