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

export const moveItem = (board, event) => {
    const itemId = event.entityId
    const { before, after } = event.changes

    const currentItem = board.sections
        .flatMap((section) => section.items)
        .find((item) => item.id === itemId)

    if (!currentItem) {
        return board
    }

    const sourceSectionId = before.section_id
    const targetSectionId = after.section_id

    const targetSection = board.sections.find((section) => section.id === targetSectionId)

    if (!targetSection) {
        return board
    }

    const updatedSections = board.sections.map((section) => ({
        ...section,
        items: section.items
            .filter((item) => item.id !== itemId)
            .sort((a, b) => a.order - b.order)
    }))

    const destination = updatedSections.find((section) => section.id === targetSectionId)
    const targetIndex = Math.max(0, Math.min(Number(after.order), destination.items.length))

    const movedItem = {
        ...currentItem,
        ...after
    }

    const destinationItems = [...destination.items]
    destinationItems.splice(targetIndex, 0, movedItem)

    const affectedSectionIds = new Set([
        sourceSectionId,
        targetSectionId
    ])

    return {
        ...board,
        sections: updatedSections.map((section) => {
            if (!affectedSectionIds.has(section.id)) {
                return section
            }

            const items = section.id === targetSectionId
                ? destinationItems
                : section.items

            return {
                ...section,
                items: items.map((item, index) => ({
                    ...item,
                    section_id: section.id,
                    order: index
                }))
            }
        })
    }
}