import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const updateItemTitle = async ({ itemId, title }) => {
    const response = await api.patch(API_ENDPOINTS.ITEM.UPDATE(itemId), { title })

    return response.data
}