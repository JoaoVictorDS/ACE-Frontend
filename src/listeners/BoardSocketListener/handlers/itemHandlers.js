export const updateItem = (board, event) => {
    const itemId = event.entityId
    const title = event.changes.after

    return {
        ...board,
        sections: board.sections.map(section => ({
            ...section,
            items: section.items.map(item => item.id === itemId
                ? { ...item, title }
                : item
            )
        }))
    }
}

export const createItem = (board, event) => {
    const newItem = {
        ...event.resource.item,
        section_id: event.resource.sectionId,
        item_values: []
    }

    return {
        ...board,
        sections: board.sections.map(section => {
            if (section.id !== newItem.section_id) {
                return section
            }

            const alreadyExists = section.items.some(item => item.id === newItem.id)

            if (alreadyExists) {
                return section
            }

            return { ...section, items: [...section.items, newItem] }
        })
    }
}

export const deleteItem = (board, event) => {
    const itemId = event.entityId

    return {
        ...board,
        sections: board.sections.map(section => ({
            ...section,
            items: section.items.filter(item => item.id !== itemId)
        }))
    }
}