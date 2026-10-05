export const createItemValue = (board, event) => {
    const newItemValue = {
        id: event.entityId,
        item_id: event.resource.item.id,
        column_id: event.resource.column.id,
        value: event.changes.after,
    }

    return {
        ...board,
        sections: board.sections.map(section => ({
            ...section,
            items: section.items.map(item => {
                if (item.id !== newItemValue.item_id) {
                    return item
                }

                const alreadyExists = item.item_values.some(itemValue => itemValue.id === newItemValue.id)

                if (alreadyExists) {
                    return item
                }

                return { ...item, item_values: [newItemValue, ...item.item_values] }
            })
        }))
    }
}

export const updateItemValue = (board, event) => {
    const itemValueId = event.entityId
    const value = event.changes.after

    return {
        ...board,
        sections: board.sections.map(section => ({
            ...section,
            items: section.items.map(item => ({
                ...item,
                item_values: item.item_values.map(itemValue => itemValue.id === itemValueId
                    ? { ...itemValue, value }
                    : itemValue
                )
            }))
        }))
    }
}

export const deleteItemValue = (board, event) => {
    const itemValueId = event.entityId

    return {
        ...board,
        sections: board.sections.map(section => ({
            ...section,
            items: section.items.map(item => ({
                ...item,
                item_values: item.item_values.filter(itemValue => itemValue.id !== itemValueId)
            }))
        }))
    }
}