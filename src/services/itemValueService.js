import api from '../services/api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const upsertItemValue = async ({ itemId, columnId, value }) => {
    const response = await api.post(API_ENDPOINTS.ITEM_VALUES.UPSERT(itemId, columnId), { value })

    return response.data
}