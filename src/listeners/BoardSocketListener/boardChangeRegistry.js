import { createItemValue, updateItemValue, deleteItemValue } from './handlers/itemValueHandlers'
import { createItem, updateItem, deleteItem, moveItem } from './handlers/itemHandlers'
import { createSection, updateSection, deleteSection, moveSection } from './handlers/sectionHandlers'
import { createColumn, updateColumn } from './handlers/columnHandlers'

export const BOARD_CHANGE_REGISTRY = {
    ITEM_VALUE: {
        CREATE: createItemValue,
        UPDATE: updateItemValue,
        DELETE: deleteItemValue,
    },

    ITEM: {
        CREATE: createItem,
        UPDATE: updateItem,
        DELETE: deleteItem,
        MOVE: moveItem,
    },

    SECTION: {
        CREATE: createSection,
        UPDATE: updateSection,
        DELETE: deleteSection,
        MOVE: moveSection,
    },

    COLUMN: {
        CREATE: createColumn,
        UPDATE: updateColumn
    },

    MEMBER: {
        // CREATE: addMember,
        // UPDATE: updateMember,
        // DELETE: removeMember,
    }
}