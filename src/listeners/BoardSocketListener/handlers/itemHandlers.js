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