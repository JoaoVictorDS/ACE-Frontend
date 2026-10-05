import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getBoardsByWorkspace = async (workspaceId) => {
    const response = await api.get(API_ENDPOINTS.WORKSPACES.BOARDS(workspaceId))

    return response.data
}

export const getBoard = async (boardId) => {
    const response = await api.get(API_ENDPOINTS.BOARDS.GET(boardId))

    return response.data
}