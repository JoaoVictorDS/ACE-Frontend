import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const createColumn = async ({ boardId, data = {} }) => {
    const response = await api.post(API_ENDPOINTS.COLUMNS.CREATE(boardId), data)

    return response.data
}

export const updateColumn = async ({ columnId, data = {} }) => {
    const response = await api.patch(API_ENDPOINTS.COLUMNS.UPDATE(columnId), data)

    return response.data
}

export const moveColumn = async ({ columnId, newOrder }) => {
    const response = await api.patch(API_ENDPOINTS.COLUMNS.MOVE(columnId), { new_order: newOrder })

    return response.data
}

export const deleteColumn = async ({ columnId, force = false }) => {
    const response = await api.delete(API_ENDPOINTS.COLUMNS.DELETE(columnId), {
        params: { force }
    })

    return response.data
}

export const getColumnsByBoard = async (boardId) => {
    const response = await api.get(API_ENDPOINTS.COLUMNS.GET(boardId))

    return response.data
}