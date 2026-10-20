import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getUserProfile = async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE)

    return response.data
}

export const getUsers = async () => {
    const response = await api.get(API_ENDPOINTS.USERS.LIST)

    return response.data
}

export const updateUserProfile = async (data = {}) => {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE, data)

    return response.data
}

export const updateUserPassword = async (data = {}) => {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE_PASSWORD, data)

    return response.data
}

export const updateUserProfileById = async ({ userId, data = {} }) => {
    const response = await api.patch(API_ENDPOINTS.USERS.ADMIN.UPDATE(userId), data)

    return response.data
}

export const deleteUser = async (userId) => {
    const response = await api.delete(API_ENDPOINTS.USERS.ADMIN.DELETE(userId))

    return response.data
}

export const reactivateUser = async (userId) => {
    const response = await api.patch(API_ENDPOINTS.USERS.ADMIN.REACTIVATE(userId))

    return response.data
}

export const createUser = async (data = {}) => {
    const response = await api.post(API_ENDPOINTS.USERS.ADMIN.CREATE, data)

    return response.data
}