import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getWorkspaceMembers = async (workspaceId) => {
    const response = await api.get(API_ENDPOINTS.WORKSPACE_MEMBERS.GET(workspaceId))

    return response.data
}

export const upsertWorkspaceMember = async ({ workspaceId, memberEmail, role }) => {
    const response = await api.post(API_ENDPOINTS.WORKSPACE_MEMBERS.UPSERT(workspaceId), {
        member_email: memberEmail,
        role
    })

    return response.data
}

export const removeWorkspaceMember = async ({ workspaceId, memberId }) => {
    const response = await api.delete(API_ENDPOINTS.WORKSPACE_MEMBERS.REMOVE(workspaceId, memberId))

    return response.data
}