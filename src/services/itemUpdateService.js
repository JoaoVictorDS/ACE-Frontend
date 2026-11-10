import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getItemUpdates = async (itemdId) => {
    const response = await api.get(API_ENDPOINTS.ITEM_UPDATES.GET(itemdId))

    return response.data
}

export const createItemUpdate = async ({ itemId, content, parentId }) => {
    const response = await api.post(API_ENDPOINTS.ITEM_UPDATES.CREATE(itemId), { content, parent_id: parentId })

    return response.data
}

export const updateItemUpdate = async ({ itemUpdateId, content }) => {
    const response = await api.patch(API_ENDPOINTS.ITEM_UPDATES.UPDATE(itemUpdateId), { content })

    return response.data
}

export const deleteItemUpdate = async (itemUpdateId) => {
    const response = await api.delete(API_ENDPOINTS.ITEM_UPDATES.DELETE(itemUpdateId))

    return response.data
}