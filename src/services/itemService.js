import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const updateItemTitle = async ({ itemId, title }) => {
    const response = await api.patch(API_ENDPOINTS.ITEM.UPDATE(itemId), { title })

    return response.data
}

export const createItem = async ({ sectionId, title }) => {
    const response = await api.post(API_ENDPOINTS.ITEM.CREATE(sectionId), { title })

    return response.data
}

export const deleteItem = async (itemId) => {
    const response = await api.delete(API_ENDPOINTS.ITEM.DELETE(itemId))

    return response.data
}