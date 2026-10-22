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

export const upsertBoardMember = async ({ boardId, memberEmail, role }) => {
    const response = await api.post(API_ENDPOINTS.BOARD_MEMBERS.UPSERT(boardId), {
        member_email: memberEmail,
        role
    })

    return response.data
}

export const removeBoardMember = async ({ boardId, memberId }) => {
    const response = await api.delete(API_ENDPOINTS.BOARD_MEMBERS.REMOVE(boardId, memberId))

    return response.data
}