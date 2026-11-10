import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getComments = async (itemId) => {
    const response = await api.get(API_ENDPOINTS.COMMENTS.GET(itemId))

    return response.data
}

export const createComment = async ({ itemId, content, parentId }) => {
    const response = await api.post(API_ENDPOINTS.COMMENTS.CREATE(itemId), { content, parent_id: parentId })

    return response.data
}

export const updateComment = async ({ commentId, content }) => {
    const response = await api.patch(API_ENDPOINTS.COMMENTS.UPDATE(commentId), { content })

    return response.data
}

export const deleteComment = async (commentId) => {
    const response = await api.delete(API_ENDPOINTS.COMMENTS.DELETE(commentId))

    return response.data
}