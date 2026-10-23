import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const createSection = async ({ boardId, name }) => {
    const response = await api.post(API_ENDPOINTS.SECTIONS.CREATE(boardId), { name })

    return response.data
}

export const updateSectionName = async ({ sectionId, name }) => {
    const response = await api.patch(API_ENDPOINTS.SECTIONS.UPDATE(sectionId), { name })

    return response.data
}

export const moveSection = async ({ sectionId, newOrder }) => {
    const response = await api.patch(API_ENDPOINTS.SECTIONS.MOVE(sectionId), { new_order: newOrder })

    return response.data
}

export const deleteSection = async (sectionId) => {
    const response = await api.delete(API_ENDPOINTS.SECTIONS.DELETE(sectionId))

    return response.data
}