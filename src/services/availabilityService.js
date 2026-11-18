
import api from './api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const getAvailability = async () => {
    const response = await api.get(API_ENDPOINTS.AVAILABILITY.LIST)

    return response.data
}

export const updateAvailabilityStatus = async (status) => {
    const response = await api.patch(API_ENDPOINTS.AVAILABILITY.UPDATE_STATUS, { status })

    return response.data
}

export const upsertAvailabilityNotes = async (notes) => {
    const response = await api.patch(API_ENDPOINTS.AVAILABILITY.UPSERT_NOTES, { notes })

    return response.data
}

export const getAvailabilityDay = async ({ userId, workDate }) => {
    const response = await api.get(API_ENDPOINTS.AVAILABILITY.ADMIN.GET_DAY(userId), {
        params: { work_date: workDate }
    })

    return response.data
}

export const getAvailabilityMonth = async ({ userId, year, month }) => {
    const response = await api.get(API_ENDPOINTS.AVAILABILITY.ADMIN.GET_MONTH(userId), {
        params: { year, month }
    })

    return response.data
}

export const updateUserAvailabilityStatus = async ({ userId, status }) => {
    const response = await api.patch(API_ENDPOINTS.AVAILABILITY.ADMIN.UPDATE_STATUS(userId), { status })

    return response.data
}

export const upsertUserAvailabilityNotes = async ({ userId, workDate, notes }) => {
    const response = await api.patch(API_ENDPOINTS.AVAILABILITY.ADMIN.UPSERT_NOTES(userId), {
        work_date: workDate,
        notes
    })

    return response.data
}

export const updateUserAvailabilityPeriods = async ({ userId, workDate, periods }) => {
    const response = await api.patch(API_ENDPOINTS.AVAILABILITY.ADMIN.UPDATE_PERIODS(userId), {
        work_date: workDate,
        periods
    })

    return response.data
}

export const getAvailabilityHistory = async ({ page, limit }) => {
    const response = await api.get(API_ENDPOINTS.AVAILABILITY.ADMIN.LOGS, {
        params: { page, limit }
    })

    return response.data
}
