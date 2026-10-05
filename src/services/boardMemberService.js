import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getBoardMembers = async (boardId) => {
    const response = await api.get(API_ENDPOINTS.BOARD_MEMBERS.GET(boardId))

    return response.data
}

export const updateBoardMemberPreferences = async ({ boardId, preferences = {} }) => {
    const response = await api.patch(API_ENDPOINTS.BOARD_MEMBERS.UPDATE_PREFERENCES(boardId), { preferences })

    return response.data
}