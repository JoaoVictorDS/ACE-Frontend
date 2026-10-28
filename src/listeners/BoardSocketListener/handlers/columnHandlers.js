export const createColumn = (board, event) => {
    const newColumn = {
        ...event.resource.column,
        restrictions: event.resource.column.restrictions ?? []
    }

    const alreadyExists = board.columns.some(column => column.id === newColumn.id)

    if (alreadyExists) {
        return board
    }

    return {
        ...board,
        columns: [...board.columns, newColumn]
    }
}

export const updateColumn = (board, event) => {
    const changedFields = Object.fromEntries(
        event.changes.fields.map(({ field, after }) => [field, after])
    )

    const updatedColumn = {
        ...event.resource.column,
        ...changedFields
    }

    return {
        ...board,
        columns: board.columns.map(column => (
            column.id === event.entityId
                ? { ...column, ...updatedColumn }
                : column
        ))
    }
}