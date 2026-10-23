export const createSection = (board, event) => {
    const newSection = {
        ...event.resource.section,
        board_id: event.resource.boardId,
        items: []
    }

    const alreadyExists = board.sections.some(section => section.id === newSection.id)

    if (alreadyExists) {
        return board
    }

    return {
        ...board,
        sections: [...board.sections, newSection]
    }
}

export const updateSection = (board, event) => {
    const sectionId = event.entityId
    const name = event.changes.after

    return {
        ...board,
        sections: board.sections.map(section => (
            section.id === sectionId
                ? { ...section, name }
                : section
        ))
    }
}

export const deleteSection = (board, event) => {
    const sectionId = event.entityId

    return {
        ...board,
        sections: board.sections.filter(section => section.id !== sectionId)
    }
}

export const moveSection = (board, event) => {
    const sectionId = event.entityId
    const { after } = event.changes

    const currentSection = board.sections.find(section => section.id === sectionId)

    if (!currentSection) {
        return board
    }

    const updatedSections = board.sections
        .filter(section => section.id !== sectionId)
        .sort((a, b) => a.order - b.order)

    updatedSections.splice(after, 0, currentSection)

    return {
        ...board,
        sections: updatedSections.map((section, index) => ({
            ...section,
            order: index
        }))
    }
}