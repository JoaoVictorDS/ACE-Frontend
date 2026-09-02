import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getWorkspaces = async () => {
    const response = await api.get(API_ENDPOINTS.WORKSPACES.LIST)

    return response.data
}

export const createWorkspace = async (data) => {
    const response = await api.post(API_ENDPOINTS.WORKSPACES.CREATE, data)

    return response.data
}
